/*---------------------------------------------------------------*/
/* Telecom Paris- J-L. Dessalles 2023                            */
/* LOGIC AND KNOWLEDGE REPRESENTATION                            */
/*            http://teaching.dessalles.fr/LKR                   */
/*---------------------------------------------------------------*/


% partial elementary English grammar

% --- Grammar
% s --> np, vp.
np --> det, n.		% Simple noun phrase
% np --> det, n, pp.		% Noun phrase + prepositional phrase 
np --> np, pp.		% Noun phrase + prepositional phrase 
np --> [kirk].
vp --> v.           % Verb phrase, intransitive verb
vp --> v, np.		% Verb phrase, verb + complement:  like X
vp --> v, pp.		% Verb phrase, verb + indirect complement : think of X 
vp --> v, np, pp.	% Verb phrase, verb + complement + indirect complement : give X to Y 
vp --> v, pp, pp.	% Verb phrase, verb + indirect complement + indirect complement : talk to X about Y
pp --> p, np.		% prepositional phrase

% -- Lexicon
det --> [the].
det --> [my].
det --> [her].
det --> [his].
det --> [a].
det --> [some].
n --> [dog].
n --> [daughter].
n --> [son].
n --> [sister].
n --> [aunt].
n --> [neighbour].
n --> [cousin].
v --> [grumbles].
v --> [likes].
v --> [gives].
v --> [talks].
v --> [annoys].
v --> [hates].
v --> [cries].
p --> [of].
p --> [to].
p --> [about].


np(Number) --> det(Number), n(Number).
np(Number) --> np(Number), pp.

s --> np(Number), vp(Number).

vp(Number) --> v(Number).
vp(Number) --> v(Number), np.        
vp(Number) --> v(Number), pp.        
vp(Number) --> v(Number), np, pp.    
vp(Number) --> v(Number), pp, pp. 

det(singular) --> [a].
det(plural) --> [many].
det(_) --> [the].
det(_) --> [her].

n(singular) --> [dog].
n(plural) --> [dogs].
n(singular) --> [aunt].
n(plural) --> [aunts].

v(singular) --> [talks].
v(plural) --> [talk].
v(singular) --> [hates].
v(plural) --> [hate].

p(_) --> [of].
p(_) --> [to].
p(_) --> [about].

v(none) --> [sleeps].    % mary sleeps
v(transitive) --> [likes].    % mary likes lisa
v(intransitive) --> [talks].    % mary talks to lisa
p(intransitive) --> [to].

v(none) --> [knows].
v(transitive) --> [knows].


vp --> v(none).
vp --> v(transitive), np.    
vp --> v(intransitive), pp.


vp --> v(diintransitive), pp, pp.

v(none) --> [talks].        % mary talks (she is not mute)
v(intransitive) --> [talks].        % mary talks to peter
v(diintransitive) --> [talks].    % mary talks to peter about the weather

n(edible) --> [apple].
n(noedible) --> [door].
v(edible) --> [eat].
vp --> v(edible), np(edible).
np(edible) --> det, n(edible).

/*
s --> np(Sem), vp(Sem).
np(Sem) --> det, n(Sem).
vp(Sem) --> v(Sem, _).
vp(Sem1) --> v(Sem1, Sem2), np(Sem2).

n(sentient) --> [daughter]; [sister]; [aunt]; [sister].
n(nonEdible) --> [door].
n(edible) --> [apple].
v(sentient, _) --> [sleeps].
v(sentient, _) --> [likes].
v(sentient, edible) --> [eats].
v(sentient, _) --> [talks].
v(sentient, _) --> [give].  
%?- s([the, daughter, eats, the, door], [ ]).
%false.
%?- s([the, daughter, eats, the, apple], [ ]).
%true .
*/

/*
np([number:sing, person:3, gender:feminine, sentience:true]) --> [mary].
n([number:sing, person:3, gender:_, sentience:true]) --> [dog].
n([number:plur, person:3, gender:neutral, sentience:false]) --> [apples].
det([number:_, person:3, gender:_, sentience:_]) --> [the].
v([subj:[number:sing, person:3, gender:_, sentience:true], event:false]) --> [thinks].
v([subj:[number:sing, person:3, gender:_, sentience:_], event:true]) --> [falls].

s --> np(FS), vp([subj:FS| _]).
np(FS) --> det(FS), n(FS).
vp(FS) --> v(FS).
*/

/*
unify(FS, FS) :- !. % Let Prolog do the job if it can

unify([ Feature | R1 ], FS) :-
    select(Feature, FS, FS1), % checks whether the Feature is in the list
    !, % the feature has been found
    unify(R1, FS1).

s --> np(FS1), vp([subj:FS2| _]),{unify(FS1,FS2)}.
*/