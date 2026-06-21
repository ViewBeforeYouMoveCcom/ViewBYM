-- Create user alert preferences table
CREATE TABLE IF NOT EXISTS user_alert_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  new_properties BOOLEAN DEFAULT TRUE,
  price_changes BOOLEAN DEFAULT TRUE,
  status_updates BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_alert_preferences ENABLE ROW LEVEL SECURITY;

-- Users can view and update their own preferences
CREATE POLICY "Users can view own alert preferences"
  ON user_alert_preferences
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own alert preferences"
  ON user_alert_preferences
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own alert preferences"
  ON user_alert_preferences
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Function to get or create user preferences
CREATE OR REPLACE FUNCTION get_user_alert_preferences()
RETURNS TABLE (
  new_properties BOOLEAN,
  price_changes BOOLEAN,
  status_updates BOOLEAN
) AS $$
BEGIN
  -- Insert default preferences if they don't exist
  INSERT INTO user_alert_preferences (user_id)
  VALUES (auth.uid())
  ON CONFLICT (user_id) DO NOTHING;
  
  -- Return preferences
  RETURN QUERY
  SELECT 
    uap.new_properties,
    uap.price_changes,
    uap.status_updates
  FROM user_alert_preferences uap
  WHERE uap.user_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update user preferences
CREATE OR REPLACE FUNCTION update_user_alert_preferences(
  p_new_properties BOOLEAN,
  p_price_changes BOOLEAN,
  p_status_updates BOOLEAN
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO user_alert_preferences (user_id, new_properties, price_changes, status_updates)
  VALUES (auth.uid(), p_new_properties, p_price_changes, p_status_updates)
  ON CONFLICT (user_id) 
  DO UPDATE SET
    new_properties = EXCLUDED.new_properties,
    price_changes = EXCLUDED.price_changes,
    status_updates = EXCLUDED.status_updates,
    updated_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the notify_new_property function to check preferences
CREATE OR REPLACE FUNCTION notify_new_property()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create notifications for published properties
  IF NEW.status = 'published' AND (TG_OP = 'INSERT' OR OLD.status != 'published') THEN
    -- Insert notification for users who have new-properties alerts enabled
    INSERT INTO notifications (user_id, type, property_id, title, message)
    SELECT 
      u.id,
      'new_property',
      NEW.id,
      'New Property Listed',
      'A new property has been listed: ' || COALESCE(NEW.title, NEW.address_line1, 'Untitled Property')
    FROM auth.users u
    LEFT JOIN user_alert_preferences uap ON uap.user_id = u.id
    WHERE u.id != NEW.agency_id -- Don't notify the agent who listed it
      AND (uap.new_properties IS NULL OR uap.new_properties = TRUE); -- Check preference (default TRUE)
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to notify price changes
CREATE OR REPLACE FUNCTION notify_price_change()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.price != OLD.price THEN
    INSERT INTO notifications (user_id, type, property_id, title, message)
    SELECT 
      u.id,
      'price_change',
      NEW.id,
      'Price Change',
      'Price changed for ' || COALESCE(NEW.title, NEW.address_line1, 'a property') || 
      ': ' || COALESCE(OLD.price::TEXT, 'N/A') || ' → ' || COALESCE(NEW.price::TEXT, 'N/A')
    FROM auth.users u
    LEFT JOIN user_alert_preferences uap ON uap.user_id = u.id
    WHERE u.id != NEW.agency_id
      AND (uap.price_changes IS NULL OR uap.price_changes = TRUE);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to notify status updates
CREATE OR REPLACE FUNCTION notify_status_update()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.market_status != OLD.market_status 
     AND NEW.market_status IN ('under_offer', 'let_agreed', 'sold') THEN
    INSERT INTO notifications (user_id, type, property_id, title, message)
    SELECT 
      u.id,
      'status_update',
      NEW.id,
      'Property Status Update',
      COALESCE(NEW.title, NEW.address_line1, 'A property') || 
      ' is now ' || REPLACE(NEW.market_status, '_', ' ')
    FROM auth.users u
    LEFT JOIN user_alert_preferences uap ON uap.user_id = u.id
    WHERE u.id != NEW.agency_id
      AND (uap.status_updates = TRUE);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers for price changes
DROP TRIGGER IF EXISTS trigger_notify_price_change ON properties;
CREATE TRIGGER trigger_notify_price_change
  AFTER UPDATE OF price
  ON properties
  FOR EACH ROW
  WHEN (NEW.status = 'published')
  EXECUTE FUNCTION notify_price_change();

-- Trigger for status updates
DROP TRIGGER IF EXISTS trigger_notify_status_update ON properties;
CREATE TRIGGER trigger_notify_status_update
  AFTER UPDATE OF market_status
  ON properties
  FOR EACH ROW
  WHEN (NEW.status = 'published')
  EXECUTE FUNCTION notify_status_update();
