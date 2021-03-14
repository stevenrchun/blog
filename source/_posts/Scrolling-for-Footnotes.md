---
title: Scrolling for Footnotes
author: Steven Chun
date: 2021-03-13
tags:
 - Statistics
 - Typography
mathjax: true
summary: How much scrolling do footnotes impose on the reader?
twitter_image: https://upload.wikimedia.org/wikipedia/commons/2/23/Brussels_sprout_closeup.jpg
---

The following is a train of thought, expounded upon here, that I had while
roasting brussel sprouts.

Here’s a toy problem:

  >  An online article has _n_ footnotes. The content of each footnote, as the
  >  name suggests, is placed at the bottom of the article, which is of length
  >  $l$[^1][^2]. The footnotes themselves are peppered throughout the article
  >  roughly evenly. For the reader to read each footnote, in the order in which
  >  they appear, before moving onto any subsequent text, how much scrolling (in
  >  terms of $l$) do the footnotes induce[^3].

This occurred to me as I was thinking about some other high effort bit regarding
footnotes and sidenotes I’m considering embarking on. As you can tell, I’m a big
fan of sidenotes on most screens. On all but mobile screens, the detritus of my
commentary appears on the sides of the main text. On phones, the sidenote
numbers appear purple and clickable, upon which the text immediately below parts
to reveal the footnote. Clicking once more hides the footnote content.

This is good because it allows me to go off on my little self-indulgent tangents
without placing too much of a burden on readers.

A newsletter I’m fond of also likes to go off on tangents, except that they are
often interesting and funny. However, it uses footnotes. So I scroll and I
scroll, read the footnote, and then I scroll and scroll while searching for my
prior place. I’ve even taken to highlighting my place in the article, so it’s
easier to find on the return journey.

So, while roasting some brussel sprouts, I thought about this. I did so with
virtually no recall of my undergraduate required stats class[^4], but a little
useful theory from some proof-based computer science classes. That being said, I
was done before the sprouts[^5] had fully caramelized, so I don’t think this is
too hard for anyone, so stick with me.


## Shut up and Calculate!

As the problem hints at, we can think of the footnotes as being uniformly
distributed throughout the article, meaning you’re equally likely to find a
footnote at some point in the text as you are anywhere else. Also, it’s a
reasonable assumption that footnotes are independent of one another, meaning one
footnote doesn’t make it more or less likely you’ll find another footnote soon
after.

More formally, the footnotes are i.i.d. (independent and identically
distributed) and uniformly distributed.

More formally, if a footnote’s location is denoted by the random variable $X$,

$$X \sim \mathcal{U}(0, l)$$

Where the squiggly means “distributed over”, $\mathcal{U}$ is the uniform distribution
over the range (in our case, inclusive) zero to $l$.

Random variables are how we’re going to think of the location of each footnote.
And there are $n$ footnotes.

Another observation is that if we think about the location of each footnote as a
point somewhere on $[0,l]$, then the distance the reader has to scroll to read
each footnote is $2(l-X)$. The 2 is because you have to scroll down and then up.

Okay, that’s nice, and helps us think about a single footnote, but thinking
about all the footnotes and summing up the distances is still confusing. That’s
okay, let’s go back to a single footnote.

If a footnote has the same chance of appearing anywhere, then the average of all
those equivalently possible positions will be its expected value. Much like the
expected value of winning a dollar on a coin toss is 50 cents[^6], the expected
location of the footnote is right in the middle, $l/2$. This is also the mean of
the uniform distribution.

Knowing this, we can say that the expected value for the _scroll_ distance is,
plugging in the expected location into our formula from above, $2(l-(l/2))$, or
$l$. Well, that’s nice.

“Alright, sure, we can expect that on average a footnote will kind of center
around the middle. But we’re not talking about the average location of each
footnote, we’re talking about the average distance scrolled for a bunch of
footnotes added together, surely we can’t just pretend each footnote is in the
middle and add it all up”, you will say.

“Yes, we can”, I will say. “Linearity of expectations”, I will say.

Linearity of expectations says that the “expected value of the sum of any finite
number of random variables is the sum of the expected values of the individual
random variables”[^7]. Our random variable is a single footnote, and we know the
expected value of the scrolling induced is $l$. Take $n$ footnotes, and the
total amount of scrolling induced is simply $nl$.

The more intuitive way of explaining this is to say that some footnotes will be
around the middle, some will be earlier in the article and induce more
scrolling, and some will be later in the article and induce less scrolling.
Generally, the earlier and later footnotes cancel each other out.

For some this will be excruciatingly obvious, but for those a little out of
practice with statistical thinking and who have some brussel sprouts to roast,
it’s an entertaining little toy problem. It’s the sort of thing where $nl$ is
something you might have guessed as the answer, but might not have been sure how
to back it up.

The distribution of a random variable defined as the sum of independent random
variables, each having a uniform distribution is known as the **Irwin-Hall
distribution**. This is like, exactly what the footnotes problem is, and its
mean is indeed $n/2$ for $n$ random variables.


<!-- Footnotes themselves at the bottom. --> ## Notes

[^1]: As a simplifying assumption, we may assume that each footnotes doesn’t add
  any length to $l$. Once the reader has scrolled the length of the article, all
  footnotes are immediately available.

[^2]: I’m thinking of an online article here or email newsletter, both of which
  have infinite page length. For a single page article, as page length
  approaches infinity footnotes (placed at the bottom of a page) would seem to
  approach endnotes (placed at the end of the chapter or book). So I’m just
  going to call them footnotes.

[^3]: That is to say, how much scrolling does the reader do specifically to go
  read a footnote and then to go back to their prior place. We’re ignoring the
  scrolling to read the actual article, as this is just $l$.

[^4]: Nor do I recall whether this is my fault or the fault of the class. It
  seemed a little like “stick kids in front of R and hope some of them take it
  and run with it”, that is to say light on theory and intuition building if you
  could do the programming. On the other hand, I have a distinct memory of
  sitting in the King Arthur Flour cafe and having an actual intuition for like,
  t-tests.

[^5]: Apparently, Brussel Sprouts are high in vitamin K, which is a
  blood-clotting factor, and thus consuming enormous amounts of them can and
  has caused trouble for people on anticoagulant treatments. For the full
  story, see [The hazards of brussels sprouts consumption at Christmas by Pettit
  et al. in The Medical Journal of
  Australia](https://onlinelibrary.wiley.com/doi/10.5694/mja12.11304), if you
  subscribe to that sort of thing.

[^6]: That is, if heads win \$1, if tails win nothing. If you’re losing a dollar
  on tails, the expected value is 0.

[^7]: Quote from Wikipedia lol
