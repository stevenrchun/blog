---
title: "Under the Hood: Linear Regression"
tags:
  - Statistics
  - Computation
mathjax: true
author: Steven Chun
date: 2020-04-25
summary: It's not your Grandfather's Econometrics!
twitter_image: https://upload.wikimedia.org/wikipedia/commons/3/3a/Linear_regression.svg
---
It  has been twenty-one days since I’ve seen another person. Actually,
it’s been more like 4-5 weeks, but every time I opened up this essay I
had to update the number, and I lost count. As the world collectively
weathers the pandemic, I find myself with an abundance of time and no
excuse to not write[1]. So, let’s talk about an old friend: linear
regression.

![graph of points with a line of best fit
drawn](https://upload.wikimedia.org/wikipedia/commons/3/3a/Linear_regression.svg)

This essay is an attempt to answer an ever escalating series of _“but how does
that work?”_. Regardless of your field, you’ve probably encountered linear
regression. As a statistical model, it’s as prevalent as it is useful. But less
attention is given to the mechanics of regression. How is it computed? Is it
hard? And at what specific point does it melt my 2015 Macbook?

For any concept there’s, like, the most abstract definition, usually math, and
then, on the opposite end of the spectrum, there’s the CPU physically flipping
logic gates to execute some machine code[2]. Searing a steak on one end, the
chemistry of the Maillaird reaction on the other, and I guess even quantum
interactions if  you wanna go further. You get the picture. A reasonable
explanation usually goes from the abstract down towards the tangible to the
point where you can apply a concept in your work. We’re going to take that
explanation and push it just a little farther than is really useful—why? Why am
I watching {% preview https://www.youtube.com/watch?v=r1t_ITj1qoA %}how olive
oil is made{% endpreview %}? Because why the hell not[3]?

![A very silly diagram describing an explanation spectrum from the abstract
(math) to the concrete (machine code), along the spectrum are a reasonable
explanation, and further down, machine code](./ExplanationSpectrum.svg)

I’m going to try to build everything from the ground up, but it will be more fun
if you have some sense of basic probability and linear algebra[4].

On the other hand, if you’re already familiar with the matrix derivation of the
OLS normal equations, you may want to skip ahead to my next post, which features
appearances by: QR factorization! Gradient descent! And the 41 year-old FORTRAN
library that underpins basically all scientific computing. But before that, we
must do theory.

You will find this essay to have the unmistakable character of someone who was
always just barely keeping up with a derivation or proof in lecture. For all of
high school and freshman year of college, I was certain that I was
not-a-math-person. This, and sleep deprivation brought on by a commitment to
overscheduling, meant that I was in a state of actual slumber for 70-80% of my
education in fundamental mathematical operations. I want to emphasize: the math
in this post _never_ came quickly to me, and if my writing appears pedantic or
outright slow, it is because I fear that a rushed assumption or unexplained
algebraic manipulation might cause an otherwise talented, curious, maybe sleepy
learner to miss the forest for the trees.

## Linear Regression is Nice

First, we must appreciate linear regression. We are like Salieri. We see the
beauty. We do not understand how it is done.[5]

I love linear regression. As much as fancy techniques like decision trees or
artificial neural networks have captured the present imagination, linear
regression continues to save lives and move nations. It’s simple and
interpretable; you can use it to make arguments about cause and effect. It lets
you know why good or bad things happen, and provides insight on how you might
promote more good things and prevent bad things.

For example, you might think, “Classical economic theory[6] suggests that making
everyone sign up for healthcare makes everyone better off—I wonder if that holds
up in the real world?”[7] You might get some data on healthcare coverage, costs,
and premiums; you could exploit the fact that Massachusetts actually did make
everyone sign up for healthcare; and then you can have a little linear
regression to estimate if people were better off. You might look at your
regression and conclude, “Hey, people are better off, like {% preview
https://www.aeaweb.org/articles?id=10.1257/aer.20130758 %}\$241{% endpreview %}
better off! We should do this nationally!” And you go and do it nationally[8],
and it goes, you know, {% preview
https://www.nytimes.com/2017/02/05/upshot/grading-obamacare-successes-failures-and-incompletes.html
%}okay{% endpreview %}.

Of course, economics is a lot more than just specifying and running a
regression. Actually, that’s probably the easiest part. But still! You can’t do
any of it without linear regression!

That is all to say, linear regression is pretty great. Abhijit Banerjee, Esther
Duflo, and Michael Kremer won the Nobel Prize last year for pioneering the use
of randomized control trials (RCTs) in alleviating poverty. Why do RCTs work so
well? Because when you run regressions on them, you can be really confident in
the results. Great stuff.


## What Does it Do?

Let’s get semi-technical. If you have one independent variable ($x$) and one
dependent variable ($y$), linear regression specifies a line of best fit in the
form $y=mx+b$, by solving for an optimal $m$ and $b$[9]. The line that “best fits”
depends on your definition of good. The standard terminology for this is that
fitting the line is an optimization problem and your measure of “good or bad” is
an objective function. An objective function that measures good is often called
a reward function, and one that measures bad is a loss function. Since, in
linear regression, you compare how far (bad) your predicted values (the line)
are from your observed values (the dots), we often think of linear regression as
using a loss function.

The _loss function de jure_ [9.9] is Ordinary Least Squares (OLS)[10]. It means you
measure how far off your prediction is by taking the Euclidean distance between
the true value and your predicted value[11] and squaring it. You do that for
each example, sum them all, and you get a number that represents the sum of the
squared errors—this is your loss, which you want to minimize.

Now, we have defined our line in the classic way as

$$y=mx+b$$

But moving forward we’re going to use the more common econometric notation of

$$\hat{y}_i= \beta_0 + \beta_1x_i =
y_i - u_i$$

What mathematical notation gains in precision it loses in legibility. However,
this is basically the same thing. $\hat{y}$[12] is again the predicted value at any point,
the carrot (called a {% preview
https://twitter.com/chemicollins/status/1236350747895308288 %}hat{% endpreview
%}) indicates that this is a predicted value which will differ from  which is
the true value, is the residual (the difference between our estimation
$\hat{y}_i$ and the truth $y_i$, and the subscript $i$ just indicates that this
is the prediction for the $i$-th[13] example in our dataset. $\beta_0$ and
$\beta_1$[14] are the parameters, or unknowns, in our model—equivalent to $b$ and
$m$ in our previous definition. These define the line; these are what we need to
solve for.


_But how does that work?_

It’s not immediately obvious how you actually go about picking the optimal
$\beta_0$ and $\beta_1$. In fact, if you ask a computer scientist and an
economist, by virtue of their training you may get very different answers[15].

Let’s start with the more precise, more standard method. To do so, we must find
a closed-form[16] solution for OLS. This is the dressing down you should get in
most introductory econometrics classes.


## Solving for Beta

First[17], let us formalize the focus of our optimization for OLS, which is often
called the Residual Sum of Squares (RSS) or the Sum of Squared Estimates of
Errors (SSE).

$$SSE(\beta_0, \beta_1) = \sum^N_{i=1} (y_i - \beta_0 - \beta_1 x_i)^2 = \sum^N_{i=1}u_i^2$$

Simply, this says that the SSE, given our model parameters, equals the sum of
each residual squared. That is, how far off our prediction is from the truth,
squared. We want to minimize this function—which means we want to find the first
order condition (FOC), the point at which the derivative of the SSE equals
zero[18].

So, we partially differentiate the SSE with regards to each parameter.

$$\frac{\delta SSE}{\delta \beta_j} = \frac{\delta \sum\limits^N_{i=1}u^2}{\delta
\beta_j} = \sum^N_{i=1}\frac{\delta u^2}{\delta \beta_j}$$

We use $\beta_j$ because this step applies to both $\beta_0$ and $\beta_1$. This
says that the SSE differentiated with respect to $\beta_j$ equals the sum of the
derivative of the square residuals. This works because differentiation is
linear, that is the derivative of the sum of the square residuals is the same as
the sum of the derivative of each residual.


Now, we apply the chain rule. Remember, the chain rule applies to functions of
the form $f(g(x)) = f'(x)g(x) * g'(x)$ and $u^2$ is actually a composite
function, the inner function is the calculation of the residual and the outer is
the square.

$$
\begin{align}
\sum^N_{i=1}\frac{\delta u^2}{\delta \beta_j} & = \sum^N_i 2(y_i - \beta_0 -
\beta_1 x_i) \cdot \frac{\delta(y_i - \beta_0 - \beta_1 x_i)}{\delta \beta_j} \\\\
& = 2\sum^N_i (y_i - \beta_0 -
\beta_1 x_i) \cdot \frac{\delta(y_i - \beta_0 - \beta_1 x_i)}{\delta \beta_j}\\\\
& = 2\sum^N_i u_i \cdot \frac{\delta(y_i - \beta_0 - \beta_1 x_i)}{\delta \beta_j}
\end{align}
$$

And to clean things up, we pop the 2 out of the summation.


You’ll note, there is still a derivative to be taken. However, here, we must
specify with which parameter we’re differentiating with respect to.
Differentiating with respect to $\beta_0$ we get:

$$
\begin{align}
\frac{\delta SSE}{\delta \beta_0} & = 2\sum^N_{i=1}u_i \cdot \frac{\delta(y_i -
\beta_0 - \beta_1 x_i)}{\delta \beta_0} \\\\
& = 2\sum^N_i u_i \cdot (-1) \\\\
& = -2 \sum^N_i u_i
\end{align}
$$

And with respect to $\beta_1$:

$$
\begin{align}
\frac{\delta SSE}{\delta \beta_1} & = 2\sum^N_{i=1}u_i \cdot \frac{\delta(y_i -
\beta_0 - \beta_1 x_i)}{\delta \beta_1} \\\\
& = 2\sum^N_i u_i \cdot (-x_i) \\\\
& = -2 \sum^N_i u_i x_i
\end{align}
$$

Once we set these to zero we have our FOCs. Since we’re again solving for zero,
we can drop the $-2$ in front of the summations—it won’t affect the result.

Our first order of First Order Conditions, rephrased to expand $u_i$:

$$
\begin {align}
\sum^N_{i=1}(y_i - \beta_0 - \beta_1 x_i) & = 0 \\\\
\sum^N_{i=1}(y_i - \beta_0 - \beta_1 x_i)x_i & = 0
\end {align}
$$

Sweet, though seeing how you might solve these is a little tricky, especially
with that summation mucking things up. So we’re going to transform these into
more standard forms which are known as the OLS Normal Equations. This is just a
little rearrangement, so don’t worry about it too much.

Starting with the FOC for $\beta_0$, let’s distribute the summation.

$$
\begin{align}
\sum^N_{i=1}(y_i - \beta_0 - \beta_1 x_i) & = 0 \\\\
\sum^N_{i=1}y_i - N\beta_0 - \beta_1 \sum^N_{i=1}x_i & = 0 \\\\
-N\beta_0 - \beta_1 \sum^N_{i=1}x_i & = - \sum^N_{i=1}y_i
\end{align}
$$

And multiply both sides by $-1$ to get a Nice Equation™.

$$N\beta_0 + \beta_1 \sum^N_{i=1}x_i = \sum^N_{i=1}y_i$$

And then the OLS Normal Equation for $\beta_1$ is the same thing just multiplied by
$\sum^N_{i=1}x_i$ since that’s the only difference between the two FOCs and all
we’ve done is move things around.

So our two OLS Normal equations are:

$$
\begin{align}
N\beta_0 + \beta_1 \sum^N_{i=1}x_i & = \sum^N_{i=1}y_i \\\\
\beta_0 \sum^N_{i=1}x_i + \beta_1 \sum^N_{i=1}x_i^2 & = \sum^N_{i=1}x_iy_i
\end{align}
$$

Since all the summation terms will add up to a constant, these are just two
linear equations with two unknowns! You might recall[19] that a linear system
with two unknowns and two constraints will usually have a unique solution.
Basically, each equation tells you something about the system, a hint that you
can use to constrain your answer. Two unknowns need two hints. You could do
linear regression with a pencil and paper[20].

Thinking about how you’d actually solve this system, if you divide the first
equation by $N$, you get:

$$
\beta_0 + \beta_1 \bar{X} = \bar{Y}
$$

Where $\bar{X}$ and $\bar{Y}$ are the respective means for all $x$ and $y$ in
your data. This is very neat and the sort of thing you might guess from the
start, but aren’t totally sure about. “Of course the line of best fit goes
through the mean of the data!” you might say, and then someone asks, “Why?” and
then you have to write a blog post. Tough.

Anyway, solve that bad boy for one of the unknowns and plug it into the other
equation. You have done the linear regression.

You might have noticed that I waffled when saying that this linear system will
have a solution. Now this is only for multivariable linear regression, which
we’re about to jump into, but it’s an important extension of thinking about OLS
in terms of constraints and unknowns. In a special case, it’s possible to not be
able to solve OLS at all. We call this constraint perfect multicollinearity. If
you have multiple explanatory variables (the “multi-”) and one of the
explanatory variables is a perfect linear combination of another (the
“-collinearity”), you cannot solve for each beta. For example, if one of the
fields in my dataset was age, and then I decided to add another field that was
age times two plus one, I break OLS. One of the constraints is just one of the
other constraints in a dress and wig and umbrella, so we actually have more
unknowns than constraints. Another way to think about this is if we have two
explanatory variables that are perfectly collinear, they’re describing the same
effect on our dependent variable. As such, it doesn’t make sense to split up one
effect into two coefficients. Luckily, this is usually an easy fix. You just
remove one of the explanatory variables, since it’s redundant. You have solved
the multicollinearity.

Now would be a good time to take a break. We did a little work. The good stuff
is yet to come. You’re probably a little hungry. A spoon of peanut butter and
some milk, definitely some coffee, that’s what I always say.

<div class="epigraph">
  <blockquote>
    <p>“A mathematician is a device for turning coffee into theorems.”</p>
  <footer>—<a href="https://en.wikipedia.org/wiki/Alfr%C3%A9d_R%C3%A9nyi">Alfréd Rényi</a>[21]</footer>
  </blockquote>
</div>


## How It’s Actually Done


Okay, so the above was a useful theoretical grounding, but computers don't
calculate linear regressions by doing algebraic substitutions. Also, the above
was univariate and commonly we want multivariate regression. So, we need a new
tool and that tool is linear algebra.


Linear algebra helps us express multivariate OLS succinctly, with the added
benefit of framing the operations much in the same way as we actually execute
them en machina[22].


Our multivariate model now looks like this

$$\hat{Y} = X\hat{B}$$

But what about our constant intercept? Well, we just make the
first column of $X$ all $1$s, which does the exact same thing. And like before:

$$e=Y - X\hat{B} = Y - \hat{Y}$$

Which says that the residuals (which we called $u$ before, but now we’ll use $e$
because that seems more common in these derivations), are, like before, equal to
the truth minus our prediction.

Same! But different. We have $n$ examples, $k$ explanatory variables, $Y$ is an
$n$ dimensional vector[23] of ground truth values, $X$ is a $n \times k$ matrix[24],
is a $k$ dimensional vector of the true parameters, and $e$ is a $n$ dimensional
vector of residuals. Visually, that looks like this:


$$
\begin{align}
\begin{bmatrix}
Y_1 \\\\
Y_2 \\\\
\vdots \\\\
\vdots \\\\
Y_n
\end{bmatrix}\_{k \times 1}
=
\underbrace{
\begin{bmatrix}
1 & X_{1,1} & X_{2,1} & \dots & X_{k,1} \\\\
1 & X_{1,2} & X_{2,2} & \dots & X_{k,2} \\\\
\vdots & \vdots & \vdots & \dots & \vdots \\\\
\vdots & \vdots & \vdots & \dots & \vdots \\\\
1 & X_{1,n} & X_{2,n} & \dots & X_{k,n} \\\\
\end{bmatrix}\_{n \times k}
\begin{bmatrix}
\hat{\beta}\_1 \\\\
\hat{\beta}\_2 \\\\
\vdots \\\\
\vdots \\\\
\hat{\beta}\_n
\end{bmatrix}\_{k \times 1}
}\_{\Tiny\text{Computes the dot product of each row and our parameters to get N predictions}}
+
\begin{bmatrix}
e_1 \\\\
e_2 \\\\
\vdots \\\\
\vdots \\\\
e_n
\end{bmatrix}\_{n \times 1}
\end{align}
$$

Same stuff as before, but nicely generalized to as many examples and as many
betas as we want[25].

Now, the sum of squared residuals is just $e$ transpose[26] times $e$. The product of
a $1 \times n$ matrix and a $n \times 1$ matrix is a scalar, so that all checks out.

Given the definition of the residuals, we can write

$$
\begin{align}
e^T e & = (y - X\hat{\beta})^T (y - X\hat{\beta}) \\\\
& = y^T y - y^TX\hat{\beta} - \hat{\beta}^T X^T y + \hat{\beta}^T X^T X\hat{\beta}
\end{align}
$$

If you are forgetting your transpose properties, and it would not be untoward to
charge this author of doing so, this last step might take a second or two.
First, we must remember that the transpose respects addition, $(A+B)^T = A^T +
B^T$. The transpose
must be commended for its reasonableness here. But we must also remember that
$(AB)^T = B^TA^T$.
At first, this seems evidence of the transposes’s deceit and chicanery. The
proof of this property, however, is so concise that to spite Fermat[27], I shall
include it in the margin[28]. Upon its consideration, we are forced to again
congratulate the transpose on its integrity.

Consolidating our previous work and exploiting the fact that $\hat{\beta}^T X^T
y = (y^T X \hat{\beta})^T$ and $y^T X \hat{\beta}$ is simply a scalar $((1
\times n) \cdot (n \times k) \cdot (k \times 1) = 1 \times 1)$ and the transpose
of a scalar is itself, we get

$$
\begin{align}
e^T e & = (y - X\hat{\beta})^T(y - X\hat{\beta}) \\\\
  & = y^T y - y^T X \hat{\beta} - \hat{\beta}^TX^Ty +
  \hat{\beta}^TX^TX\hat{\beta} \\\\
  & = y^Ty - 2\hat{\beta}^TX^Ty + \hat{\beta}^TX^TX\hat{\beta}
\end{align}
$$

As before, we now need to take the derivative with respect to our betas. Matrix
calculus is fundamentally the same as scalar calculus, but the interactions with
dimensions and the transpose add extra complexity, so don’t worry too much if
the next piece isn’t immediately obvious.

$$
\begin{align}
e^Te & = y^Ty - 2\hat{\beta}^TX^Ty + \hat{\beta}^TX^TX\hat{\beta} \\\\
\frac{\delta e^Te}{\delta\hat{\beta}} & = -2X^Ty + 2X^TX\hat{\beta} = 0
\end{align}
$$

Which gives us our multivariate OLS normal equations in matrix form:

$$(X^TX)\hat{\beta} = X^Ty$$

Nice. The only unknown in this equation is $\hat{\beta}$ so let’s put that on
one side of the equation. To do so only requires recalling that a matrix times
the inverse of itself gives the identity matrix $I$ (a matrix with 1s along the
diagonal and zeros elsewhere) which does nothing to any matrix applied to it.
Multiply both sides by the inverse $(X^TX)^{-1}$

$$
\begin{align}
(X^TX)^{-1}(X^TX)\hat{\beta} & = (X^TX)^{-1}X^Ty \\\\
I\hat{\beta} & = (X^TX)^{-1}X^Ty
\end{align}
$$

And discard $I$ because it ipso facto does nothing:

$$ \hat{\beta} = (X^TX)^{-1}X^Ty$$

Aha! We have it! Fully generalized, here at last is the precise definition of
what we must do to obtain any regression, for any dataset, for any problem,
forever[29]. And the truth is, most applied classes will leave it at that.
Knowing that $\hat{beta} = (X^TX)^{-1}X^T$ allows you to derive a whole bunch of
useful things about OLS, like that it’s the Best Linear, Unbiased, and Efficient
estimator, and if you make some assumptions about the disturbances, you can get
into the wonderful land of standard errors and heteroskedasticity[30]. But to
actually solve this equation, you type “reg” into Stata and you’re done. If
you’re like me, that’s unsatisfying.


This math is the theoretical essence of the empirical revolution. Clinical
trials and fiscal policy in just a few lines of linear algebra. There’s a good
reason the applied world often stops here—everything that comes next is an
implementation detail. But, Dear Reader, believe me when I say that the next
time we ask, _“But how does that work”_?


That’s where it gets spicy.

^^^^
[1] One might consider this my _Walden_ moment. On the other hand, you wouldn’t be
blamed for thinking “Steven, you’re watching Bon Appetit in your apartment.
You’re not in a remote New England cabin.” Consider, however, that Thoreau’s
mother made {% preview https://www.newyorker.com/magazine/2015/10/19/pond-scum %} the 20 minute walk from Concord to Walden Pond to bring him food {% endpreview %} and {% preview https://austinkleon.com/2019/08/30/thoreaus-laundry/ %}do his laundry{% endpreview %}. I do my own laundry.

[2] You might want to fact check this. I don’t know hardware.

[3] What I mean, of course, is that there is no other reason. Learning adds
richness to each second of life.

[4] If you know what a matrix is, you're golden. I picked this topic partly to
refresh myself on matrix factorization, because I have a hunch that's where this
is all going.

[5] A lot of writing is stealing. In fact, if you see humans as just pattern
recognition machines, and that’s not a particularly bad way to see us, all
creation is stealing. But I must admit I stole this comparison from Craig
Silverstein, who made it first about Sanjay Ghemawat in this {% preview https://www.newyorker.com/magazine/2018/12/10/the-friendship-that-made-google-huge %}wonderful New Yorker piece on Sanjay and Jeff Dean{% endpreview %}.

[6] See _Equilibrium In Competitive Insurance Markets: An Essay on the Economics
of Imperfect Information_ by Rothschild and Stiglitz, 1976.

[7] You could also ask much sillier questions, like, “Do people stay alive longer
so they can save money on their estate taxes?” {% preview
https://www.nber.org/papers/w8158 %}These guys did{% endpreview %}.

[8] Well actually, you publish a paper—{% preview https://www.aeaweb.org/articles?id=10.1257/aer.20130758 %}this paper{% endpreview %}—and then someone important
reads it and goes and writes some policy.

[9] More generally, linear regression defines a hyperplane of best fit. It is a
cool word, hyperplane, but it just means a shape that is one dimension less than
the space it exists in. In 2-dimensions (charts and graphs and such), that’s a
line (1-dimensional), in 3-dimensions, a plane (2-dimensional), and anything
higher: hyperplanes (ooh, very cool). In math, once you get past 3-dimensions
you slap a sweet name on it and stop counting. Vectors are 1-dimensional,
matrices are 2-dimensional, everything after is a tensor. Nice.

[9.9] French for, _loss function with juice_.

[10] Least Squares makes sense, you want the line that produces the least
squared error. Ordinary because this is plain old linear least squares, as
opposed to the extra-ordinary non-linear least squares.

[11] You know this one: it’s just your regular geometric distance. What’s more
fun is that there’s also {% preview
https://en.wikipedia.org/wiki/Taxicab_geometry %}Manhattan Distance{% endpreview %}, where you take the distance as if you had to get there via city blocks! New
York, baby!

[12] Pronounced “y-hat”.

[13] $i$ is the canonical notation for index (AKA position). If you have two
indices, people denote the second with $j$. This is very stupid. Try to tell the
difference, handwritten on a blackboard, halfway across a lecture hall.

[14] Pronounced “beta naught” (or beta zero) and “beta one”.

[15] I have the pleasure of being both (in a very loose sense), and it’s this
dissonance that got me started on this post.

[16] Closed-form is a funny term, but generally it means you can get to a
solution by using a predefined set of mathematical operations, e.g. Normal
Math™. Things like algebra and calculus will get you to the answers you seek. Of
course, what constitutes Normal Math™ is completely arbitrary, but generally
things like infinite series and iterative methods don’t count.

[17] If you’re already familiar with the univariate derivation of OLS, feel free
to skip ahead to the next section. This section is heavily drawn from this nice
worksheet I found from Queen’s University at Kingston’s {% preview
http://qed.econ.queensu.ca/pub/faculty/abbott/econ351/351note02.pdf %}Introductory
Econometrics class{% endpreview %}.

[18] Of course, the first derivative might mean a minimum or a maximum, but as I
understand, SSE is quadratic, which means that a local min or max is the global
min or max, and it’s also convex, which means that there is a global min. The
proof of convexity is currently beyond me. If you have a simple proof, write me!

[19] Don’t take this as a suggestion that you _should recall_. I don’t care,
that’s why I’m telling you again.

[20] This, of course, would be silly. That didn’t stop an old professor of
mine—a distinguished academic—from asking us to do k-means by hand. It ended up
being over 800 manual calculations of mean and distance. Pedagogy did not seem
to be his forte.

[21] His friend, Paul Erdős, would have argued that a mathematician is a device
for turning amphetamines into theorems. He wrote a lot of papers.

[22] {% preview
https://softwareengineering.stackexchange.com/questions/312445/why-does-expressing-calculations-as-matrix-multiplications-make-them-faster
%}This StackOverflow question{% endpreview %} does a good job of explaining why
matrix operations are fast on computers. Basically, a lot of linear operations
can be done in parallel, since they’re independent. Also, computer caches (L1,
L2, L3…) work better when memory access is “spatially and temporally coherent”.
Basically, it has structure and isn’t jumping all over the place.

[23] Commonly referred to as a column vector.

[24] Matrices are denoted number of rows by number of columns. In this case,
each row of $X$ is a point in our dataset with $k$ features.

[25] This section is largely sourced from [here](https://web.stanford.edu/~mrosenfe/soc_meth_proj3/matrix_OLS_NYU_notes.pdf)

[26] written as $^T$ or $^\prime$, the transpose flips x and y dimensions, so our column
vector is now a row vector.

[27] In 1637, in the margin of one of his books, Pierre de Fermat proposed a
conjecture, now known as {% preview
https://en.wikipedia.org/wiki/Fermat%27s_Last_Theorem %}Fermat’s Last Theorem{%
endpreview %}, that would take 358 years to solve. While proposing his theorem,
Fermat mentioned that he had already proved it, but that he didn’t have enough
space in the margin to write it down. “I have discovered a truly marvelous
demonstration of this proposition that this margin is too narrow to contain.” is
a phrase that haunted nearly 4 _centuries_ of mathematicians.

[28] **Theorem**: Let $A$ and $B$ be matrices. $(AB)^T = B^TA^T$<br/><br/>
**Proof:**
  First observe that the $ij$ entry of $AB$ can be written as<br/><br/>
  $$(AB)\_{ij} = \sum^n_{k=1}a_{ik}b_{kj}$$<br/><br/>
  Furthermore, if we transpose a matrix, we switch the rows and the columns.
  These facts together mean we can write
  $$((AB)^T)\_{ij} = (AB)\_{ji} = \sum^n_{k=1}a_{jk}b_{ki}$$<br/><br/>
  and<br/>
  $$\begin{align}
    (B^TA^T)\_{ij} & = \sum\nolimits^n_{k=1}(B^T)\_{ik}(A^T)\_{kj} \\\\
                   & = \sum\nolimits^n_{k=1}b_{ki}a_{jk} \\\\
                   & = \sum\nolimits^n_{k=1}a_{jk}b_{ki}
    \end{align}
  $$<br/><br/>
  And here we can see that these last two results are the same summation, just
  with their members flipped around. **Q.E.D**<br/>
  [Source](http://www.math.ucdenver.edu/~esulliva/LinearAlgebra/ABT.pdf)


[29] That is, like we mentioned, as long as there’s no perfect
multicollinearity.

[30] If you want to go in that direction, fine. {% preview
https://web.stanford.edu/~mrosenfe/soc_meth_proj3/matrix_OLS_NYU_notes.pdf
%}Here{% endpreview %}, go to section 4.
