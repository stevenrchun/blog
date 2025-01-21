---
title: 'Capacity Conduction Convection'
date: 2024-06-24 23:35:48
mathjax: true
author: Steven Chun
summary: Travails in temperature.
tags:
  - The Extremely Obvious
---
**Author’s note**: _It’s been more than a year and a half since I last published
anything here[^1]. Time to write has been scarce. I haven't done much that warrants writing.
So the momentum of writing slows and starting up again seems ever more daunting.
But I've found that my own ignorance can be momentum enough, even if it produces
no groundbreaking writing. So this article is largely just that, a reason to
write powered by ignorance about temperature.
In endurance sports, the consensus seems to be that there
are huge gains just to be had through consistent but relatively easy efforts.
This is often called Zone 2[^2] training, after the particular percentage range
of your maximum heart rate. I consider the following tiny science
explainer to be kind of the same thing. Of course, just because this is light
writing practice doesn’t mean you shouldn’t read it. Reading, as much as
writing, is a muscle that benefits use. So get working._

![An oil painting of river winding through a lush landscape on a misty morning. Trees dot the left
bank, on the right a wooden fence marks the
land.](https://uploads2.wikiart.org/images/ivan-shishkin/misty-morning-1897.jpg
"Misty Morning, by Ivan Shishkin, 1897")

Consider these indisputable facts of life: being submerged in room temperature
air is pleasant, but being submerged in room temperature water will kill you
(after a while)[^3]. Water just feels colder than air at the same temperature,
much like metal. But you burn your finger faster on a hot pan than hot water.
Water takes a lot of energy to heat up, so we use it to cool nuclear reactors
and put out fires. But wetsuits keep you warm by trapping the water? Every chef
keeps two towels on them, one dry for grabbing hot things and one for wet work
like wiping. Since water is so cooling, why not one towel for the grabbing and
the wiping? 

What’s up with that

What’s the deal with that

![Jerry Seinfield doing his what's up with that
pose](https://i.redd.it/eqxxx9dz61eb1.jpg "what's the deal with blogs these
days")

Look, like any pseudo intellectual I can be like, “well it’s the specific heat
of the material.” And I think I have said that before. But uh, I always forget
what that means. Off the cuff my guess is always something muddled about how
much heat something can hold or how quickly something heats, but these are not
principled understandings. I do not know what the unit of measurement specific
heat is measured in.

But over and over again I find myself puzzling at the interplay of heat and
material in my everyday life. And so I must once again admit my ignorance
online, so that I may live in slightly less ignorance, confident in my ability
to explain the physical reasons for temperature based discomfort. Maybe someday
I’ll write about stuff I can speak about confidently and with authority. It is
not this day.

I will thus attempt to explain, in layperson terms, the principle
characteristics that explain the experience of hot and cold.

There are at least three things that affect how a material reacts to thermal
energy. There might be more, but these seem sufficient to explain everyday
experience. They are specific heat capacity, thermal conductivity, and
convection.


## Specific Heat Capacity

If you have an object, it will take a certain amount of energy (Joules) to raise
its temperature (Kelvin) by 1. This is called the object's heat capacity, and
its dimensions are joules per kelvin. Now, this means that an immense object will
simply have a higher heat capacity. So that’s why we divide by the mass to
achieve the material’s specific heat capacity in joules per grams kelvin. 

Here are some common materials and their specific heat capacities:

* Indoor air: 1.012 $jg^{-1}k^{-1}$
* Aluminum: 0.897 $jg^{-1}k^{-1}$
* Water at 25C 4.1816 $jg^{-1}k^{-1}$
* Animal tissue 3.5 $jg^{-1}k^{-1}$

Okay so some answers, but also some questions. Takes a lot of energy to heat
water. We know that. If we want to dump heat into something, water is often a
good choice for this reason. We can cool our nuclear reactor with water. Also,
we (thinking water sacks) can store a lot of heat. One way of thinking about
this is that a human body cooling a single degree can raise by a degree the
temperature of 3.5 times its mass in indoor air. That’s about 1.5 shipping
containers of air. 

Okay so water, and by extension people, are very dense heat containers. This
kind of explains why water feels colder than air. It takes more of your internal
heat to warm your surroundings if you’re surrounded by water rather than air.
Emphasis on kind of. But how come grabbing a hot pan with a wet towel can burn
you when a dry towel wouldn’t? Why do wetsuits work if water is such a good
temperature sink?

That leads us to our final two concepts


## Thermal Conductivity and Convection

Thermal conductivity, this guy is measured in watts per meter kelvin. A
beautiful unit. All it’s really saying is “how many Watts (joules per second)
can you push across a meter (distance) at given temperature. You need to know
the current temperature of the object because a substance’s thermal conductivity
will change as it heats up.

What you’ve got to know is that, as far as the common metals go, Aluminum is one
of the best to ever do it. It rocks in at 237 watts per meter kelvin around room
temperature. That’s higher than my functional threshold power on a bike. It’s a
little less than a third of a horsepower. Aluminum can *move* heat.

Here are the thermal conductivities for our common materials (animal tissue is
extremely variable, so there isn’t really a reasonable single value, think
blubber insulation).


* Indoor air: 0.02614 $\frac{W}{mK}$
* Aluminum: 237 $\frac{W}{mK}$
* Water at ~25C 0.6084 $\frac{W}{mK}$

And this is why heatsinks on computers and other electronics are commonly aluminum. You’re sinking heat into the aluminum, but not because it can hold a lot, but because _it can move it away really fast_.

But the aluminum can’t just hold onto the heat. It has an even lower specific heat capacity than air and once the heat sink gets hotter than the chip it’s supposed to cool, it’ll start dumping that heat back into the system. And the air around the heat sink neither conducts well nor has a high specific heat capacity. But it does have one important quality: it moves. 

A heat sink with no airflow around it basically doesn’t work. But once the air is moving, its poor thermal conductivity and low specific heat capacity don’t so much matter as does its ability to immediately move the hot air out of contact with the heat sink and replace it with cooler air. Its ability to convect. And something we know intuitively[^4] is that the rate of temperature exchange increases the greater the difference between the temperature of the substances in contact. Things cool faster in the freezer than in the fridge. So a steady stream of cooler air greatly increases the effective cooling on the heat sink. This too we know intuitively: wind chill is really just the convective effect of wind on our bodies. Liquids also convect, which, combined with their high specific heat capacities make them the gold standard for cooling systems.


## Seeing the Cathedrals

{% raw %}
<blockquote class="twitter-tweet" data-theme="light"><p lang="en" dir="ltr">There are cathedrals everywhere for those with eyes strapped to my cathedral kaleidoscope goggles</p>&#8212; Benny Feldman 🦋 (@Feldfrog) <a href="https://twitter.com/Feldfrog/status/1759286280779641308?ref_src=twsrc%5Etfw">February 18, 2024</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
{% endraw %}

With these new words, our threadbare understanding of the principles of specific heat capacity, thermal conductivity, and convection, we can begin to see their hand at work in the examples I mentioned before. While they both convect, water has a higher thermal conductivity and specific heat capacity than air, meaning that it’ll chill you much faster.

And while its notably high specific heat capacity means it’s good for as a liquid coolant, if you remove water’s ability to flow by trapping it in a wetsuit, the neoprene of which has an extremely low thermal conductivity, the human body can mostly generate enough warmth to counteract the thermal diffusion. This actually runs opposite to the common idea that a wetsuit somehow benefits from letting in water for you to warm up. Rather, a wetsuit is a means for managing the inevitable entry of water by 1. restricting the amount and flow of water that enters and 2. surrounding it with a good insulator, which all has the effect of neutralizing as much water’s thermal properties as possible without the complexity of a drysuit.

When it comes to kitchen burns, metal’s thermal conductivity allows it to burn with brief touches. A towel, woven with countless air gaps between threads benefits from the insulating properties of air while dry but while wet gains thermal conductivity more akin to water, meaning the heat moves an order of magnitude faster from the pan into your hand.

Capacity, conduction, and convection. Simple concepts, good enough for explaining like 98% of daily temperature gradients and their consequences.


<!-- Footnotes themselves at the bottom. -->
## Notes

[^1]:
     In that time my newsletter provider has been shuttered. RIP TinyLetter.

[^2]:
     Zone 2 usually refers to  60-70% of your max heart rate. Also, yes I know it’s all Zone 2 this Zone 2 that these days. Heart rate training has gone mainstream, and it’s been drowned in content. Counterpoint: oh my god let me enjoy an analogy.

[^3]:
     Okay I think I’ll probably get some people objecting to this, but no really it seems to be true: quite a few sites (take the [American Boating Association for example](https://americanboating.org/safety_hypothermia_in_the_summertime.asp)) that water temperatures of even 70-80 degrees Fahrenheit can lead to hypothermia and loss of consciousness after many hours. I couldn’t find anything at the equilibrium temperature in water at which a person could survive indefinitely given sufficient food.

[^4]:
     But is apparently called “[Newton’s Law of Cooling](https://en.wikipedia.org/wiki/Lumped-element_model#Newton.27s_law_of_cooling)”

