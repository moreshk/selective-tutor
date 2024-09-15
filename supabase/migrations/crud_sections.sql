-- Update the policy for sections table to use the is_admin column
DROP POLICY IF EXISTS "Allow write access for admin users" ON sections;
CREATE POLICY "Allow write access for admin users" ON sections
  USING (auth.role() = 'authenticated' AND (SELECT is_admin FROM auth.users WHERE id = auth.uid()));

-- Create a function to check if a user is an admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (SELECT is_admin FROM auth.users WHERE id = auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create an RPC to get all sections (for admin use)
CREATE OR REPLACE FUNCTION get_all_sections()
RETURNS SETOF sections AS $$
BEGIN
  IF (SELECT is_admin()) THEN
    RETURN QUERY SELECT * FROM sections ORDER BY order_index;
  ELSE
    RAISE EXCEPTION 'Access denied. Admin only.';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create RPCs for CRUD operations on sections
CREATE OR REPLACE FUNCTION create_section(title TEXT, description TEXT, order_index INTEGER)
RETURNS UUID AS $$
DECLARE
  new_id UUID;
BEGIN
  IF (SELECT is_admin()) THEN
    INSERT INTO sections (title, description, order_index)
    VALUES (title, description, order_index)
    RETURNING id INTO new_id;
    RETURN new_id;
  ELSE
    RAISE EXCEPTION 'Access denied. Admin only.';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION update_section(section_id UUID, new_title TEXT, new_description TEXT, new_order_index INTEGER)
RETURNS VOID AS $$
BEGIN
  IF (SELECT is_admin()) THEN
    UPDATE sections
    SET title = new_title, description = new_description, order_index = new_order_index, updated_at = NOW()
    WHERE id = section_id;
  ELSE
    RAISE EXCEPTION 'Access denied. Admin only.';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION delete_section(section_id UUID)
RETURNS VOID AS $$
BEGIN
  IF (SELECT is_admin()) THEN
    DELETE FROM sections WHERE id = section_id;
  ELSE
    RAISE EXCEPTION 'Access denied. Admin only.';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;