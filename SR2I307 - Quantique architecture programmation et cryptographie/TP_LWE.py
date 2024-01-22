#https://sagecell.sagemath.org/
q = 971
n = 15
m = 45
beta = 2

Zq = IntegerModRing(q)
A = random_matrix(Zq, m, n)%q

def balance(e):
    return ZZ(e)-q if ZZ(e)>q/2 else ZZ(e)

def keygen():
    sA = matrix(Zq, n, 1, [randint(-beta, beta) for _ in range(n)])
    eA = matrix(Zq, m, 1, [randint(-beta, beta) for _ in range(m)])
    pKA = (A*sA + eA)%q
    return sA, eA, pKA


def encrypt(mu, pkA):
    eB = matrix(Zq, n, 1, [randint(-beta, beta) for _ in range(n)])
    sB = matrix(Zq, m, 1, [randint(-beta, beta) for _ in range(m)])
    pkB = (sB.T*A + eB.T)%q
    eB2 = randint(-beta, beta)
    c = (sB.T*pkA)[0][0] + eB2 + mu*floor(q/2)
    return pkB, c

def decrypt(pkB, c, sA):
    return abs(round((floor(q/2)**-1)*balance(c - (pkB*sA)[0][0])))
"""
def balance_multi(e):
    r = matrix(Zq, e.nrows(), e.ncols(), [0 for _ in range(e.nrows()*e.ncols())])
    for i in range(0,e.nrows()):
        for j in range(0,e.ncols()):
            r[i][j] = ZZ(e[i][j])-q if ZZ(e[i][j])>q/2 else ZZ(e[i][j])
    return r
"""
def balance_multi(e):
    nrows, ncols = e.nrows(), e.ncols()
    r = matrix(Zq, nrows, ncols, [[ZZ(e[i][j]) - q if ZZ(e[i][j]) > q/2 else ZZ(e[i][j]) for j in range(ncols)] for i in range(nrows)])
    return r

def keygen_multi():
    sA = matrix(Zq, n, k, [randint(-beta, beta) for _ in range(n*k)])
    eA = matrix(Zq, m, k, [randint(-beta, beta) for _ in range(m*k)])
    pKA = (A*sA + eA)%q
    return sA, eA, pKA


def encrypt_multi(mu, pkA):
    eB = matrix(Zq, n, k, [randint(-beta, beta) for _ in range(n*k)])
    sB = matrix(Zq, m, k, [randint(-beta, beta) for _ in range(m*k)])
    pkB = (sB.T*A + eB.T)%q
    eB2 = matrix(Zq, k, k, [randint(-beta, beta) for _ in range(k*k)])
    c = (sB.T*pkA) + eB2 + mu*floor(q/2)
    return pkB, c

def decrypt_multi(pkB, c, sA):
    nrows, ncols = k, k
    r = matrix(Zq, nrows, ncols, [[abs(round((floor(q/2)**-1)*balance(c[i][j] - (pkB*sA)[i][j]))) for j in range(ncols)] for i in range(nrows)])
    return r

e = 0
k = 10
for i in range(10):
    sA, eA, pkA = keygen_multi()
    mu = matrix(Zq, k, k, [randint(0, 1) for _ in range(k*k)])
    pkB, c = encrypt_multi(mu, pkA)
    if(mu != decrypt_multi(pkB, c, sA)):
        print("erreur")
        e=e+1
print("fin. "+"erreur : ",e)

"""
e0 = 0
e1 = 0
for i in range(1000):
    sA, eA, pkA = keygen()
    pkB, c = encrypt(0, pkA)
    if(0 != decrypt(pkB, c, sA)):
        print("erreur 0")
        e0=e0+1
    pkB, c = encrypt(1, pkA)
    if(1 != decrypt(pkB, c, sA)):
        print("erreur 1")
        e1=e1+1
print("fin. "+"erreur avec 0: ",e0,", erreur avec 1: ",e1)
"""
