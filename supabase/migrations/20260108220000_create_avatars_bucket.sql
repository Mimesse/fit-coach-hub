-- Create avatars bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT DO NOTHING;

-- Create policy to allow public read access to avatars
CREATE POLICY "Public Read avatars" ON storage.objects
FOR SELECT
USING (bucket_id = 'avatars');

-- Create policy to allow authenticated users to upload to avatars
CREATE POLICY "Authenticated Upload avatars" ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'avatars'
  AND auth.role() = 'authenticated'
);

-- Create policy to allow users to update/upsert their own files
CREATE POLICY "User Update Own avatars" ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'avatars'
  AND auth.uid() = owner
);
