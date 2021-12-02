---
title: A Very Brief History of Linear Algebra Subroutines (Linear Regression II)
date: 2020-09-06
mathjax: true
tags:
  - Computation
  - History
author: Steven Chun
summary: JPL, BLAS, and a man on a train
---
Consider some features $X$ and some labels $y$.

Then, navigate the quagmire that is Python dependency management and survive
having multiple versions of Python installed on your machine with your sanity
mostly intact[1].

And run something like this

{% codeblock lang:python line_number:false %}
from sklearn.linear_model import LinearRegression
...
reg = LinearRegression().fit(X, y)
{% endcodeblock  %}

What happens when you call LinearRegression().fit(X,y)?

In our {% preview https://blog.stevenchun.me/2020/04/linear-regression-I/ %}
last post,{% endpreview %} we derived the least squares normal equations.

$$ \hat{\beta} = (X^TX)^{-1}X^Ty$$

So, from a theoretical standpoint you’d be 100% correct if you said,
“Scikit-learn solves the least squares normal equations”. Good job. And to go
further, you could talk about using different matrix factorizations to
efficiently solve the normal equations, like SVD or QR or LU. But there’s a
story we miss by ignoring the actual code and hardware that will solve least
squares.

Like pretty much all modern software, Scikit-learn and its contemporaries stand
on the shoulders of giants: NASA’s Jet Propulsion Laboratory, Oak Ridge National
Laboratory, and work done in the 70s to revolutionize scientific computing.

Understanding this work and its modern forms is critical to an end-to-end
understanding of why your 2015 Macbook is burning the tops of your thighs as you
run an ill advised regression for a term paper. This is not a particularly
technical post, as I don’t think I could do justice to the hardware
optimizations involved. Instead, we’ll dig into modern linear regression as a
way to develop a mental picture of the structures involved.

Scikit’s {% preview
https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.LinearRegression.html
%}documentation{% endpreview %} mentions that its LinearRegression model is “just plain Ordinary Least Squares (scipy.linalg.lstsq)”. Okay, what is
Scipy doing?

A cursory examination of the {% preview
https://github.com/scipy/scipy/blob/99b8660a5bb838cfcebf5e9e63512aed982a40e8/scipy/linalg/basic.py#L1047
%}code for scipy.linalg.lstsq{% endpreview %} reveals that
it...doesn’t do anything? It checks for any mismatch in the shapes of the
input, but there’s no matrix factoring, not even a dot product.

## LAPACK and BLAS

Rather than performing the calculations itself, SciPy actually calls a LAPACK
subroutine to do all the matrix factoring work. Which subroutine depends on
which option you pass to it: “gelsd” for divide-and-conquer SVD, “gelsy” for
complete orthogonal factorization, or “gels” for QR/LQ factorization. LAPACK in
turn calls a BLAS subroutine to do all the scalar, vector, and matrix work.
These programs are very particular. Different architectures will have different
implementations.
Some of the really-fast implementations were hand-written by a guy on sabbatical
from the Japanese Patent Office.

### LAPACK

LAPACK was a project out of Tennessee and Rice Universities, the Numerical
Algorithms Group, a private non-profit, and Oak Ridge and Argonne National
Laboratories in the early 90s. This assemblage of researchers all saw the need
for a standardized, fast package that provided “{% preview
https://www.researchgate.net/profile/Christian_Bischof/publication/220781801_LAPACK_A_Portable_Linear_Algebra_Library_for_High-Performance_Computers/links/00b7d519e119d012bc000000/LAPACK-A-Portable-Linear-Algebra-Library-for-High-Performance-Computers.pdf
%}routines for solving systems of
simultaneous linear equations, least-squares solutions of overdetermined
systems of equations, and eigenvalue problems.{% endpreview %}”

These sorts of things had been tried before in LINPACK and EISPACK, but those
packages weren’t written with modern computer architectures in mind. The
original Intel Pentium chip had come out in 1993 and brought a split L1 cache[2]
into the mainstream[3][4]. The basic problem here is that CPUs got quite fast at
multiplying numbers, but accessing those numbers from memory hadn’t kept up. So,
programs that didn’t pay attention to the cost of moving data started being
bottlenecked by the speed of memory access rather than the speed of their
processors.

LAPACK was written in FORTRAN 77 for modern memory hierarchies with multiple
parallel, processors; and that made it stupid fast. Of course, you can’t write a
library that’ll be optimal for all architectures. You have different cache
sizes; you might have an L3 or L4 cache. But LAPACK didn’t need to, because it
wasn’t actually doing the low-level calculations. For that, it relied on
whatever Basic Linear Algebra Subroutines—BLAS[5]— the user had installed.

### BLAS

In the late 70s, the nerds at JPL came out with a FORTRAN library of
thirty-eight basic linear algebra subroutines. Stuff like a dot-product,
implemented in a way that was fast and correct. This way an aeronautical
engineer didn’t have to worry that his code for, like, a 2-norm[6] handled a
complex vector correctly. And that might mean fewer rocket crashes.

While it started out as an actual library, BLAS persisted more as a
specification. Anyone could write a BLAS implementation that was fast on their
hardware, and any program designed to use BLAS could use any of these
implementations.

If you’re reading this on a Mac, you’re running {% preview
https://developer.apple.com/documentation/accelerate/blas %}Apple’s implementation{% endpreview %} of BLAS
and LAPACK, specially optimized, like much of Apple software, for its own
hardware.

### 3 Things for Faster Linear Algebra

This is the technical lesson sandwiched between some interesting history. LAPACK
and BLAS take the same approach to speed at the algorithmic and operational
level, respectively. That approach is[6.5]
1. Vectorize
2. Minimize Data Movement
3. Parallelize


Vectorization is taking advantage of hardware’s propensity for vector
operations. You can multiply pairs of numbers together in a loop and sum them,
but it will be faster if you compute a dot product on a row and column vector.


Data movement means from different levels of memory: disk to main memory to
cache and in and out of registers. These all are all costly. You want to spend
your time computing floating point operations, not accessing memory. These are a
few of Jeff Dean’s “{% preview
http://static.googleusercontent.com/media/research.google.com/en/us/people/jeff/stanford-295-talk.pdf
%}Numbers Everyone Should Know{% endpreview %}”:
* L1 cache reference: 0.5 ns
* L2 cache reference: 7 ns
* Main memory reference: 100 ns
* Read 1MB sequentially from memory: 250,000 ns
* Disk seek: 10,000,000 ns

Parallelization is in the same vein as vectorization, but instead spreads a
problem over multiple threads/processors. If there are large chunks of the
problem that can be computed completely independently, you can reduce the time
needed almost linearly in the number of threads.

This is all a lot of work. But there’s a useful idea here that some constructs
are so widely used that it’s worth a lot of effort to eek out small performance
gains which then aggregate to huge performance gains.

One example from a 2017 talk on Google’s[7] efforts to develop faster, more
efficient hash tables[8]:

{% blockquote %}
“Hash tables are incredibly performance sensitive. At Google, right now, as I am
speaking, in our fleet, one percent of the CPU’s are computing something in a
hash table. As I am speaking, more than four percent of Google’s RAM is owned by
a hash table. And that’s just C++”
{% endblockquote %}

The same idea applies to a dot product. If your supercomputer weather simulation
does a lot of dot products, you might save days of compute time by having a good
BLAS implementation for your hardware.

This is where Mr. Kazushige Goto comes in.

## The Man from the Patent Office

![Kazushige Goto standing next to a research
poster](https://graphics8.nytimes.com/images/2005/11/28/business/28super.1841.jpg)

Prior to 2002, Kazushige Goto worked in the Japanese Patent Office. While he was
there, he developed a knack for tinkering with the subroutines on computers to
improve bottlenecks. I say this, of course, in the same sense that Babe Ruth
developed a knack for hitting home runs. From a {% preview
https://www.nytimes.com/2005/11/28/technology/writing-the-fastest-code-by-hand-for-fun-a-human-computer-keeps.html
%}2005 New York Times profile{% endpreview %}:

{% blockquote %}
“To help in his work, Mr. Goto purchased a Digital Equipment workstation based
on the Alpha microprocessor in 1994 to perform a simulation.  But when it
arrived he could not understand why it was performing so slowly. So he explored
the Alpha's design to see where the performance bottlenecks were.

He later purchased a second Alpha-based computer and by rewriting the crucial
subroutines was able to improve its performance to 78 percent of its theoretical
peak calculating speed, up from 44 percent.

Although he was not formally trained in computer or software design, he
perfected his craft by learning from programmers on an Internet mailing list
focusing on the Linux operating system for the Alpha chip. His curiosity quickly
became a passion that he pursued in his free time and during his twice daily
two-hour train commute between his job in Tokyo and his home in Kanagawa
Prefecture.

'I would frequently work on these problems until midnight,' he said. 'I did it
to relax.'”
{% endblockquote %}

Naturally, this sort of hardware whispering doesn’t go unnoticed,
and eventually Mr. Goto got the call up to the Texas Advanced Computer Center at
UT Austin to apply his gifts to supercomputing while on sabbatical from the
patent office. At the time of this profile, 4 out of the 11 fastest
supercomputers were running GotoBLAS, Goto’s optimized implementation for
Intel’s Nehalem processor.

The narrative of Goto-the-Auteur’s is painted in sharp relief to contemporary
efforts to automate the process of optimizing BLAS for different processors. The
Automatically Tuned Linear Algebra Software or ATLAS is a BLAS implementation
that can perform a sort of hyperparameter sweep on any processor to identify a
reasonably good BLAS implementation. This sort of approach means that ATLAS is
often the first good BLAS implementation available on a new processor, but is
eventually eclipsed by hand-tuned implementations.

Needless to say, I find this immensely aesthetic. The idea that deep learning,
whose signature trait seems to be the ability to replicate those domains of
man—art, perception, language—with all its forward pass matrix multiplications,
might itself still be subservient to one man’s lonely craft. Of course, I expect
ATLAS and its ilk to improve. Compilers, a related field, has already begun to
cede territory to deep learning powered heuristics. But, you know, at least for
a while, state of the art can be a man on a train before work.

________________
[1] For this, the sanity maintenance I mean, I like a combination of {% preview https://pipenv.pypa.io/en/latest/ %}pipenv{% endpreview %} for projects and {% preview https://github.com/pyenv/pyenv %}pyenv{% endpreview %} for changing my global python version.

[2] If you have a rough idea of what an L1 cache is, here’s an insanely thorough
{% preview
https://stackoverflow.com/questions/55752699/what-does-a-split-cache-means-and-how-is-it-usefulif-it-is
%}StackOverflow on what a split L1 does.{% endpreview %}

[3] At the time, Intel was facing competition from a company called Cyrix, who
was also releasing some very nice x86 chips. But then, Quake was released by id
Software, which targeted the Pentium processor’s ability to interleave floating
point and integer operations, something Cyrix’s chips couldn’t do. “Quake was
extremely popular, and everyone used it in their performance tests -- and thus
hammered the Cyrix chips, even though the Cyrix was faster in ordinary use, in
business/work/Windows operation, indeed in every other game except Quake. And
ultimately that killed Cyrix off.”  From {% preview
https://liam-on-linux.livejournal.com/49259.html %}here{% endpreview %}

[4] Did you know x86 just means a system that’s compatible with the instruction
set first used on the Intel 8086 chip, the precursor to the Pentium? I didn’t.
Well, now I do. Such is the epistemic problem of writing a blog post in order to
learn about what you’re writing about.

[5] Obviously. Honestly, I’m way more in on the all-cap, pronounceable acronym,
compared to like, the current state of open source naming. I mean look at the
{% preview https://www.apache.org/index.html#projects-list %}list of projects{% endpreview %} under the Apache Foundation. What is this...{% preview http://guacamole.apache.org/ %}Guacamole{% endpreview %}? {% preview http://kafka.apache.org/ %}Kafka{% endpreview %}?
Oh God, there’s a project called {% preview http://chemistry.apache.org/ %}Chemistry{% endpreview %}, please let it have something to do
with—No. From its homepage: “Important time-saving note for chemists: the Apache
Chemistry project has nothing to do with chemistry or chemicals!” It’s a CMS
interoperability standard. And Steve? Steve is the Foundation’s python-based
voting system.

[6] A 2-norm is just the Euclidean distance of the vector. I have no idea how it
should interact with complex numbers. This way, I don’t have to!

[6.5] This is straight from the {% preview
http://www.netlib.org/lapack/lug/node61.html %}LAPACK user manual{% endpreview
%}.

[7] Disclaimer: I work at Google. I was not involved in this work.

[8] {% preview https://www.youtube.com/watch?v=ncHmEUmJZf4&feature=youtu.be %}Source{% endpreview %}. This is a really excellent talk even if you’re not big on C++
internals.
