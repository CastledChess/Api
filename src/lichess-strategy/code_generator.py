import base64
import hashlib
import os

# Step 1: Generate a random code verifier (a random string) 
code_verifier = base64.urlsafe_b64encode(os.urandom(32)).decode('utf-8').rstrip('=')

# Step 2: Compute the SHA256 hash of the code_verifier
sha256_hash = hashlib.sha256(code_verifier.encode('utf-8')).digest()

# Step 3: Encode the hash in Base64 URL format to get the code challenge
code_challenge = base64.urlsafe_b64encode(sha256_hash).decode('utf-8').rstrip('=')

code_verifier, code_challenge

print(code_verifier, code_challenge)