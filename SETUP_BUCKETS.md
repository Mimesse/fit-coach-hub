# Setup Buckets Supabase

Para que o upload de avatars funcione, é necessário criar o bucket `avatars` no Supabase.

## Opção 1: Criar manualmente via Console Supabase

1. Acesse https://app.supabase.com → Seu projeto
2. Vá em **Storage** → **Buckets**
3. Clique em **Create a new bucket**
4. Nome: `avatars`
5. Desative "Private bucket" (marque como público)
6. Clique **Create bucket**

## Opção 2: Usar SQL

Cole no SQL Editor do Supabase:

```sql
-- Create avatars bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT DO NOTHING;

-- Create policy to allow public read access
CREATE POLICY "Public Read" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');

-- Create policy to allow authenticated users to upload
CREATE POLICY "Authenticated Upload" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'avatars'
  AND auth.role() = 'authenticated'
);

-- Create policy to allow users to update their own files
CREATE POLICY "User Update Own" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'avatars'
  AND auth.uid() = owner
);
```

Após criar o bucket, o upload de avatars funcionará normalmente.
