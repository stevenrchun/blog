---
title: A Practical Guide to Light
date: 2021-12-02
mathjax: false
tags:
 - The Extremely Obvious
author: Steven Chun
summary: Plants, glass, and melanoma.
twitter_image: ./forest.JPG
---

![A sunlit forest](./forest.JPG)

I know little about the forms of light I encounter. Sometimes, I know what to do
about it—block it with sunscreen, dim it before bed, but I have no cohesive
understanding that informs these rituals. For something so pervasive, pleasant,
and dangerous, it’s a weird blind spot to have.

Outside, exposed to the unfiltered rays of the sun, it’s wise to apply
sunscreen. Surely, this light tans and causes skin cancer. Yet I, normally
liberal with my sunscreen use, work and drive for hours unconcerned in front of
large glass windows. At the same time I parrot the oft repeated fact that truck
drivers tend to get skin cancer on the left side of their face, the side exposed
to the sun[^1]. This is inconsistent.

I also keep plants. For most of these plants, I situate them in front of large
windows to get sunlight. South facing windows are best, but I mostly make do
with a pair of large North facing panes. So, clearly window light is sufficient
for photosynthesis. For some of my _Nepenthes_, tropical pitcher plants, I add
powerful grow lights. I have normal lights in my ceiling, of course. But these
are not those, these are _grow_ lights. But why?

And if you’ve gotten a sun lamp for your Seasonal Affective Disorder, would a
grow light get you through the long New Hampshire winters just the same?

What does blue light actually do and is everyone who’s buying blue light glasses
just doing it because glasses frame your face nicely?

The questions go on and none of my roommates have much in the way of an answer.
So now I have to write this.


## Kinds of Light

The lights we interact with most each day are 1. Sunlight and 2. Whatever
miserable lightbulb you or your corporate overlord have installed over your
desk. Since the second is really just the imitation crab of the electromagnetic
spectrum, let’s first understand sunlight.

The first thing to know is that sunlight is bright, up to 3 orders of magnitude
brighter than any home environment. Even shade on a sunny day can be brighter
than a fully lit room.


The second thing to know is that the spectrum, the wavelengths that make up
sunlight, is quite unlike any artificial light. This peculiar quality of
sunlight has informed the development and death of virtually all life on Earth.

Here’s the emission spectrum of the sun, along with how much of that reaches the
surface:

![Spectrum of Solar Radiation for Earth](https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Solar_spectrum_en.svg/1920px-Solar_spectrum_en.svg.png)

This graph tells us a lot of cool things. One is that even though there are
obviously more complicated things going on, we can mostly model the Sun’s
emissions as radiation[^2] from a blackbody that’s 5778 Kelvin. Another is that
the atmosphere is putting in work to absorb a lot of the sun’s power, especially
Ozone (O3) which is blocking a bunch of UV. The most relevant part is that
unfiltered sunlight is mostly visible, ultraviolet, and infrared light.


## Unfiltered Sunlight (The Biggest Oof)

Aside from enabling all life on Earth, the sun is pretty bad for you. Tans[^3],
sunburns, and skin cancer[^4] are all damage caused by light, specifically the
UV spectrum[^5]. UV is typically broken down into the near-optic UV-A, between
320nm and 400nm, and UV-B, between 280nm and 320nm, which is the more energetic
of the two[^6]. There’s also UV-C, which is the rest of the shorter end of the
UV spectrum and would cancer the crap out of all living things on Earth if the
atmosphere didn’t block it.

UV-A and UV-B are what most sunscreen labels will talk about. UV-A is bad for
you in a lot of the same ways as UV-B, but it’s UV-B that does most of the
tanning, sunburning, and cancer-giving. Both accelerate the ageing of skin by
damaging the collagen fibers. All this skin bad stuff is referred to as the
Erythemal Action Spectrum. We can combine what we know about the irradiance at
various wavelengths with their damaging potential to come up with something like
this, which I found on Wikipedia (warning, log scale).


![The Erythemal Action Spectrum](https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Erythemal_action_spectrum.svg/1920px-Erythemal_action_spectrum.svg.png)


All it’s saying is that there’s (luckily) a roughly inverse relationship between
the damage a wavelength causes and its prevalence in sunlight. Where the
sunlight spectrum and the Erythemal action spectrum cross is the wavelength that
has the energy and prevalence to do the most damage, and it’s right there in the
UV-B range.

Conclusion: unfiltered sunlight is really bad for you, it makes you ugly and
makes you die. Wear sunscreen.

**But What About Vitamin D?**

Sure, some of the Vitamin D we get comes from cells on our skin using [UV-B from
the sun to turn cholesterol into a Vitamin D precursor, which your liver and
kidneys actually turn into Vitamin
D](https://www.yalemedicine.org/news/vitamin-d-myths-debunked). Under certain
circumstances, 10-15 minutes of sun, a few times a week is sufficient for
Vitamin D production. However, those circumstances are heavily affected by “the
season, the time of day, where you live, cloud cover, and even pollution” as
well as age—“people ages 65 and over generate only one-fourth as much as people
in their 20s do”—and skin color—“African Americans have, on average, about half
as much vitamin D in their blood as white Americans” (quotes from
[here](https://www.health.harvard.edu/staying-healthy/time-for-more-vitamin-d)).
Beyond that, above the 37th parallel, your skin makes virtually no Vitamin D in
non-summer months. So all in all, it seems you should probably try to get your
Vitamin D from diet and maybe supplements, and not really rely on sun exposure.

![Map of the US showing the 37th parallel](https://domf5oio6qrcr.cloudfront.net/medialibrary/1957/latitude-and-vitamin-d-production-in-the-skin.jpg)


## Windows (Car and Otherwise)

I don’t wear sunscreen indoors, and I don’t think I’ve ever burned in front of a
window. So it stands to reason that windows would block UV light. This is mostly
correct. [Your standard window glass will block UV-B
rays](https://hps.org/publicinformation/ate/q12082.html) (this seems to be a
property of glass itself, so you don’t need to worry if you live in an old
home), but let a good amount of UV-A light through. As we discussed, you’re
probably not going to burn from this, but you may tan from a lot of exposure and
there's a very real carcinogenic effect. UV-A also penetrates cloud cover, which
is why you can still tan on cloudy days.

Car windshields are specially treated to block UV-A, so that’s good, but the
side and back windows are just normal glass and will only block UV-B, hence the
stories of side-specific truck driver skin cancers.

This is kind of crazy to me? We used to think UV-B did all the damage, but then
we realized UV-A did plenty and started marketing our sunscreens as “broad
spectrum” but we just kind of forgot about windows? I don’t know, maybe you
don’t really get that much sun exposure from windows, but I really thought of
the indoors as totally sun-safe. Windows can be treated with solar film to
reflect all UV, but I’ve never heard of anyone doing this. I’m not sure how much
of a tint this film introduces, but from this picture it looks like a lot, which
would suck.


![UV treated and untreated panes of glass](https://www.glasstint.co.nz/uploads/7/4/0/1/7401232/op30_2_orig.jpg)


Conclusion: I don’t know, sitting in a warm beam of light in your home is great,
and probably worth the damage. But if I’m riding shotgun on a 10 hour road trip,
I'm definitely going to apply some SPF moisturizer. One of the conclusions from
this is that you should definitely be applying moisturizer with sunscreen every
morning, stuff like
[this](https://www.cerave.com/skincare/moisturizers/am-facial-moisturizing-lotion-with-sunscreen).
You may try, but you can’t hide from the sun.


## Plants

I’ve always held a loose connotation between raw sunlight and plants, assuming
that indoor lighting lacked some particular quality necessary for
photosynthesis. However, it is primarily a difference in power and wavelength
that separates plant from people lights.

For a plant hobbyist, you can find an excellent and in-depth explanation of the
relationship between color spectrum and plant growth by Robert Pavlis
[here](https://www.gardenmyths.com/led-grow-lights-color-spectrum/). For the
less obsessed, here’s a short summary:

Photosynthesis is primarily accomplished by use of Chlorophylls A and B. They
are somewhat specific in the wavelengths of light they actually absorb, which
you can see in this graph:

![Chlorophyll absorption spectrum](https://www.gardenmyths.com/wp-content/uploads/2018/06/LED-chlorophyll.jpg)

You can see clear peaks in what mostly correspond to the red and blue spectrums
of optical light. And if you see a professional grow operation, you’ll often
notice a purple-ish glow, the product of lights that are optimizing for this
sort of absorption spectrum.

However, this is a simplified view, obtained via isolated chlorophyll in a lab
environment. The reality of what happens in a leaf involves more chemicals with
different absorption peaks, and other priorities, like light filtering through
upper canopies.

A more complete picture of photosynthesis might be given by a graph like this:
![Fuller plant action spectrum](https://www.gardenmyths.com/wp-content/uploads/2018/06/LED-light-absorbed-by-plant-300x214.jpg)

So grow lights can be summarized as extremely bright (exactly how one would
measure bright is enough material for another post, you’ve got watts, foot
candles, lux, flux, irradiance, etc) with specific peaks, usually in the red and
blue wavelengths. That’s it! So a houseplant absolutely photosynthesizes a
little using the light from your everyday lights, it’s just nowhere near enough
to sustain it.


## Blue Light and Lights for the Blues

[Blue light does not cause any additional sort of eye
strain](https://health.clevelandclinic.org/do-blue-light-blocking-glasses-actually-work/);
glasses marketed as relieving eye strain or headaches are likely snake oil.
[Blue light can definitely make it difficult to fall
asleep](https://www.health.harvard.edu/blog/will-blue-light-from-electronic-devices-increase-my-risk-of-macular-degeneration-and-blindness-2019040816365),
but you’re probably better off just using some form of Mac Night Shift /
[Flux](https://justgetflux.com/). A lot of eye strain can be chalked up to
focusing on near objects like screens for too long, and there’s a lot of mileage
to be had by something akin to the [20-20-20
rule](https://www.healthline.com/health/eye-health/20-20-20-rule#research). It
boils down to every now and then stare at something far away to help your eyes
relax from all the near focusing they’ve been doing.

As for light therapy for Seasonal Affective Disorder, I can’t find any
guidelines for the sort of light spectrum that should be used. [This
article](https://www.mayoclinic.org/diseases-conditions/seasonal-affective-disorder/in-depth/seasonal-affective-disorder-treatment/art-20048298)
indicates that 10,000 lux is the recommended intensity for a SAD light box. Lux
is a measure of illuminance over a unit of area, but weighted for the
wavelengths that the human eye perceives as brighter. Each of these measures has
a “radiant” equivalent which treats all wavelengths equally, but lux is more
useful for human applications.

A grow light will easily exceed 10,000 lux, and it’s really not something that
is fun to stare into or around, so I probably wouldn’t recommend using that for
light therapy. But! Beyond the various joys of caring for plants, I wouldn’t
discount the fact that my full-ish spectrum grow lights really light up my
peripheral vision at my desk. It makes for a much brighter room during gloomy
San Francisco days.


## Solar Panels

These ideas all apply to solar panels as well. Not unlike chlorophyll (though
through an unrelated effect), solar panels react differently to different parts
of the spectrum. You get graphs like this:

![Spectrum of silicon absorption over the sunlight spectrum](https://qdsolarinc.com/wp-content/uploads/2020/02/Si-Absorption-e1581357321237-1024x653.png)


Here, we recognize our standard solar spectrum and overlaid the amount of each wavelength that the silicon in a standard solar cell
can convert. And advances in solar panel technology basically either come from making them
cheaper, or increasing the range of wavelength that they can effectively
utilize.

None of this is groundbreaking, but it felt good to collapse all these various
questions into basic comparisons about spectra, absorption, and intensity.

Wear sunscreen.


<!-- Footnotes themselves at the bottom. --> ## Notes

[^1]: This seems to be true. Not specifically for truck drivers, but [in
general](https://healthland.time.com/2011/06/21/study-driving-may-contribute-to-left-side-skin-cancers/).
The effect is also flipped for countries where the driver sits on the right.

[^2]: A blackbody is a theoretical, perfectly opaque object that absorbs all
wavelengths. The way to think of it is “what if we had something that was just a
sphere that gets hot and does nothing else”.

[^3]: I’ve occasionally heard people who rationalize their early-summer tans as
prophylactic, to prevent future burn. According to the FDA, the [additional
melanin from a tan is equivalent to about 2-4
SPF](https://www.fda.gov/radiation-emitting-products/tanning/risks-tanning),
which is laughable. But I also get that being nice and tan can be part of your
interpretation of beauty. That’s fine! I would just really really try to avoid
sunburns and basically always wear sunscreen.

[^4]: I’ve often referred to all skin cancer as “melanoma” which is very
incorrect, but I feel this is a pretty common layperson use. It turns out, UV
causes most nonmelanoma skin cancers, basal cell carcinoma  and squamous cell
carcinoma which seem to be fairly curable, and causes a large percentage of
melanomas, which are the most dangerous.
[Source](https://www.skincancer.org/risk-factors/uv-radiation/).

[^5]: It seems IR has some bad effects, since it penetrates deeper, and optical
light can still be bad for you in the same way looking into the sun is bad for
you.

[^6]: The shorter the wavelength, the greater the energy.
