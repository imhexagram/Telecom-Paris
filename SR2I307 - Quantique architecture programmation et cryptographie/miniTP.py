
def gen_product(max_value):
    """
    Generates N = p*q
    """
    p = random_prime(max_value)
    q = random_prime(max_value)
    return p, q, p*q

def shor_quantique(a, N):
    """
    Replace the quantum part for small N
    Computes the order of a in the group Z/NZ* i.e. the smallest r such that a^r-1 % N = 0
    :a: integer
    :N: integer
    """
    r=1
    while (a^r-1) % N != 0:
        r+=1
    return r

def shor_classique(a, r, N):
    """
    Given an integer a, its order r in the group Z/NZ* and a RSA public key,
    compute the factorisation of N when it is possible
    """
    assert((a^r-1) % N ==0)
    if gcd(a, N) != 1:
        return a, N/a
    if((r % 2) != 0):
        return "Echec"
    elif ((a^(r/2)+1) % N == 0):
        return "Echec2"
    else :
        p=gcd((a^(r/2)+1),N)
        return p, N/p

"""
p, q, N = gen_product(2^10)
print(p, q, N)
print(shor_quantique(167, N))
"""

"""
factor 314191
try a =101, 192, 127
"""