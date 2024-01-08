q = 971
n = 15
m = 45
beta = 2

Zq = IntegerModRing(q)
A = random_matrix(Zq, m, n)%q

def balance(e):
    return ZZ(e)-q if ZZ(e)>q/2 else ZZ(e)

def keygen():
    sA = matrix(Zq, n, 1, [randint(1, q) for _ in range(n)])%q
    eA = matrix(Zq, m, 1, [randint(-beta, beta) for _ in range(m)])
    pKA = (A*sA + eA)%q
    return sA, eA, pKA


def encrypt(mu, pkA):
    eB = matrix(Zq, n, 1, [randint(-beta, beta) for _ in range(n)])
    sB = matrix(Zq, m, 1, [randint(1, q) for _ in range(m)])%q
    pkB = (sB.T*A + eB.T)%q
    eB2 = randint(-beta, beta)
    c = (sB.T*pkA)[0][0] + eB2 + mu*floor(q/2)
    return pkB, c

def decrypt(pkB, c, sA):
    return abs(round(floor((q/2)**-1)*balance(c - (pkB*sA)[0][0])))

for i in range(10):
    sA, eA, pkA = keygen()
    pkB, c = encrypt(0, pkA)
    if(0 != decrypt(pkB, c, sA)):
        print("erreur 0")
    pkB, c = encrypt(1, pkA)
    if(1 != decrypt(pkB, c, sA)):
        print("erreur 1")
print("fin")