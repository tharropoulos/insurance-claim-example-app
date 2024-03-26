# Example Insurance App

This is an Next.js / Flask simple application for creating insurance claims. Users can provide

- Policy number (string)
- Date of accident (date/time)
- Accident type (string, options: Car accident, Property damage, etc.)
- Description of the accident (string)
- Injuries reported (boolean)
- Damage details (text)
- Images (list of image files)

in order to create an insurance claim. File uploading is handled using Supabase
blob storage, the authentication is built using `flask_jwt_extended` and the database
provider is NeonDB. It uses pytest for testing. I wanted to have a bit more time in order
to iron out the quirks.
