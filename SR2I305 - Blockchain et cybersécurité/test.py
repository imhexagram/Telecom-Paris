import hashlib

#header_hex=("30000000000000000051f5de334085b92ce27c03888c726c9b2bb78069e55aeb6b236b03111580819a1f5dddf37af5769063f055cd9a8167946bfeb3c095be5da1442663985403867578")
header_hex=("0100000081cd02ab7e569e8bcd9317e2fe99f2de44d49ab2b8851ba4a308000000000000e320b6c2fffc8d750423db8b1eb942ae710e951ed797f7affc8892b0f1fc122bc7f5d74df2b9441a42a14695")
header_bin = bytearray.fromhex(header_hex)
hash = hashlib.sha256(hashlib.sha256(header_bin).digest()).digest()
block_hash = hash[::-1].hex()
print(block_hash)



#https://emn178.github.io/online-tools/sha256.html
#https://blockchain-academy.hs-mittweida.de/litte-big-endian-converter/
