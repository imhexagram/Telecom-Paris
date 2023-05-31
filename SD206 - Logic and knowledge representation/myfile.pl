parent(marge, lisa).
parent(marge, bart).
parent(marge, maggie).
parent(homer, lisa).
parent(homer, bart).
parent(homer, maggie).
parent(abraham, homer).
parent(abraham, herb).
parent(mona, homer).
parent(jackie, marge).
parent(clancy, marge).
parent(jackie, patty).
parent(clancy, patty).
parent(jackie, selma).
parent(clancy, selma).
parent(selma, ling).

female(mona).
female(jackie).
female(marge).
female(ann).
female(patty).
female(selma).
female(ling).
female(lisa).
female(maggie).
male(abraham).
male(herb).
male(homer).
male(bart).
male(clancy).



child(C,P) :-
    parent(P,C).

mother(X,Y) :-
    parent(X,Y),
    female(X).

grandparent(X,Y) :-
    parent(X,Z), % note that the a variables scope is the clause
    parent(Z,Y). % variable Z keeps its value within the clause

sister(X,Y) :-
    parent(Z,X), % if X gets instantiated, Z gets instantiated as well
    parent(Z,Y),
    female(X),
    X \== Y. % can also be noted: not(X = Y).

ancestor(X,Y) :-
    parent(X,Y).
ancestor(X,Y) :-
    parent(X,Z),
    ancestor(Z,Y). % recursive call
    
aunt(A,C) :-
    parent(P,C),
    sister(A,P).
    
last_elt([_First|Rest], Last) :-
    last_elt(Rest, Last).
last_elt([Last],Last).

extract(X, [X|Rest], Rest).
extract(X, [Y|Q], [Y|Rest]) :-
    extract(X, Q, Rest).

insert(X, L, AugmentedList) :-
    extract(X, AugmentedList, L).
    
permute([], []).
permute([First|Rest], PermutedList) :-
    permute(Rest, PermutedRest),
    extract(First, PermutedList, PermutedRest).

/*   
attach(A, B, L) :-
    last_elt(A, Last_A),
    insert(Last_A, B, L_insert),
    extract(Last_A, A, Rest_A),
    attach(Rest_A, L_insert, L).
attach(A, [], A).
attach([], B, B).
*/

attach([], B, B).
attach([A1|A_Rest], B, [A1|L]) :-
    attach(A_Rest, B, L).
    
assemble(A, B, C, L) :-
    attach(B, C, L1),
    attach(A, L1, L).

sub_list(A, B) :-
    attach([_, A, _], B, _L).

remove(_, [], []).
remove(X, [X|L], L).
remove(X, [Y|L], [Y|L2]) :-
    remove(X, L, L2).

duplicate([],[]).
duplicate([A1|A], [A1,A1|B]) :-
    duplicate(A, B).
