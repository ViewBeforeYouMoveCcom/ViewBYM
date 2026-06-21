-- Create notifications table for buyer alerts
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('new_property', 'price_change', 'status_update')),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);

-- RLS policies for notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users can only see their own notifications
CREATE POLICY "Users can view own notifications"
  ON notifications
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can mark their own notifications as read
CREATE POLICY "Users can update own notifications"
  ON notifications
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Function to create notifications for new properties
CREATE OR REPLACE FUNCTION notify_new_property()
RETURNS TRIGGER AS $$
DECLARE
  agent_user_id UUID;
BEGIN
  -- Only create notifications for published properties
  IF NEW.status = 'published' AND (TG_OP = 'INSERT' OR OLD.status != 'published') THEN
    -- Get the user_id of the agent who owns this property
    SELECT user_id INTO agent_user_id
    FROM agency_members
    WHERE agency_id = NEW.agency_id
    LIMIT 1;
    
    -- Insert notification for all users who have new-properties alerts enabled
    -- Exclude the agent who created it
    INSERT INTO notifications (user_id, type, property_id, title, message)
    SELECT 
      u.id,
      'new_property',
      NEW.id,
      'New Property Listed',
      'A new property has been listed: ' || COALESCE(NEW.title, NEW.address_line1, 'Untitled Property')
    FROM auth.users u
    LEFT JOIN user_alert_preferences uap ON uap.user_id = u.id
    WHERE u.id != COALESCE(agent_user_id, NEW.created_by) -- Don't notify the agent
      AND (uap.new_properties IS NULL OR uap.new_properties = TRUE); -- Check preference (default TRUE)
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new property notifications
DROP TRIGGER IF EXISTS trigger_notify_new_property ON properties;
CREATE TRIGGER trigger_notify_new_property
  AFTER INSERT OR UPDATE OF status
  ON properties
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_property();

-- RPC to get unread notification count
CREATE OR REPLACE FUNCTION get_unread_notification_count()
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::INTEGER
    FROM notifications
    WHERE user_id = auth.uid() AND is_read = FALSE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RPC to mark notification as read
CREATE OR REPLACE FUNCTION mark_notification_read(notification_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE notifications
  SET is_read = TRUE
  WHERE id = notification_id AND user_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RPC to mark all notifications as read
CREATE OR REPLACE FUNCTION mark_all_notifications_read()
RETURNS VOID AS $$
BEGIN
  UPDATE notifications
  SET is_read = TRUE
  WHERE user_id = auth.uid() AND is_read = FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
