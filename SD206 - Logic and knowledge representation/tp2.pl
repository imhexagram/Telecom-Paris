action(state(middle, onbox, middle, not_holding),
    grab,
    state(middle, onbox, middle,holding)).
action(state(P, floor, P, T),
    climb,
    state(P, onbox, P, T)).
action(state(P1, floor, P1, T),
    push(P1, P2),
    state(P2, floor, P2, T)).
action(state(P1, floor, B, T),
    walk(P1, P2),
    state(P2, floor, B, T)).


success(state(_, _, _, holding),[]).
success(State1, [A|Plan]) :-
    action(State1, A, State2),
    success(State2,Plan).
    
go(Plan) :-
    success(state(door, floor, window, not_holding),Plan).
    
/*
success( state(_,_, _, holding), [ ]).
success( State1, [Act | Plan]) :-
    action(State1, Act, State2),
    success(State2,Plan).

ape :-
    success(state(door,floor, window,not_holding), Plan),
    write(Plan).
*/

mirror2(Left, Right) :-
    invert(Left, [ ], Right).
invert([X|L1], L2, L3) :-    % the list is 'poured'
    invert(L1, [X|L2], L3).    % into the second argument
invert([ ], L, L).        % at the deepest level, the result L is merely copied

palindrome(L) :-
    mirror2(L, L).

palindrome1(L) :-
    palindrome_accu(L, []).
palindrome_accu(L,L) :- !.
palindrome_accu(L,[_|L]) :- !.
palindrome_accu([First|Rest],L) :-
    palindrome_accu(Rest,[First|L]).

empty(X) :-
    retract(X),
    fail.
empty(_).

/*
findany(Var, Pred, [Var|Results]) :-
    call(Pred),
    %assert(found([Var|_])),
    retract(Pred),
    findany(Var, Pred, Results),
    assertz(Pred).
%findany(Var, Pred, []).
*/
findany(Var, Pred, Results) :-
    (call(Pred),
    assert(found(Var)),
    fail;
    collect_found(Results)).
collect_found([R|Results]) :-
    retract(found(R)),
    !,
    collect_found(Results).
collect_found([]).


% adapted from I. Bratko - "Prolog - Programming for Artificial Intelligence"
% Addison Wesley 1990
isa(bird, animal).
isa(albert, albatross).
isa(albatross, bird).
isa(ostrich, bird).
isa(kiwi, bird).
isa(willy, kiwi).
isa(crow, bird).

food(albatross,fish).
food(bird,grain).

locomotion(bird, fly).
locomotion(kiwi, walk). % kiwis don't fly, it seems
locomotion(ostrich, run).

known(Fact) :-
    Fact, % checks wether Prolog succeeds while executing Fact
    !. % no need to seek further
known(Fact) :-
    Fact =.. [Property, Concept, Value], % Fact is a foncteur, with the concept as first argument.
    isa(Concept, ParentConcept), % getting the parent concept
    SuperFact =.. [Property, ParentConcept, Value], % substituting for the parent concept
    known(SuperFact). % This will instantiate Value

habitat(Animal, continent) :-
    not(fly(Animal)),
    !.
habitat(_, unknown).
    
fly(Animal) :-
    known(locomotion(Animal,M)),
    M=fly.

