---
title: Does the NERC Fan Still Exist?
date: 2025-01-20
tags:
  - Energy
  - Climate
twitter_image: ./modern_nerc_fan.png
---
*The views expressed in this post are mine alone. They in no way reflect the views or work of my employer.*

One big energy news item these days is the growth of datacenters. Feeding those
concerns are reports from [utilities
themselves](https://www.datacenterdynamics.com/en/news/us-electric-utilities-predict-surge-in-power-demand-from-data-centers-and-ai-report/)
that they’re expecting unprecedented load growth due to new datacenter
construction. Of course, these are forecasts and forecasting is a messy
business. For one, it’s hard to tell how much of this is the same datacenter
project calling up different utilities and expressing interest.
[Duplication](https://x.com/ShanuMathew93/status/1822995559889740087) is likely
widespread and will bias the estimates upwards. But there’s also the question of
how good utilities are at forecasting to start with. I was listening to “[A
Skeptic’s Take on AI and Energy
Growth](https://heatmap.news/podcast/shift-key-episode-10-ai-data-centers)” on
Shift Key and the guest brought up the “NERC Fan” as metanym for utility’s
tendency to overestimate future load growth. This is the NERC Fan, as first
presented in *The NERC Fan in Retrospect and Lessons for the Future* by Nelson,
Peck, and Uhler (1989):

![Original NERC fan, continue reading for description](nercfan.png "The OG")


What are we looking at? On the y-axis you have US electricity sales in billions
of kilowatt-hours, on the x-axis you have years. You see one thicker line going
all the way from 1951 to somewhere in the 1980s (I think), this line represents
the “net energy for load” so basically just electricity load aka how much energy
was required to meet customer demand. Now you have thinner lines branching off
from the main trunk starting in the 70s: these are representations of utility
load **forecasts**. They’re required by law to submit these to NERC, the North
American Electric Reliability Corporation, which is a nonprofit to which the US
government defers a good amount of oversight over the grid. Now back to the
graph, you’ll notice that the forecasts are heavily biased towards larger load
growth than actually occurs. This was enough of a trend that Nelson et al wrote
this paper which chiefly points out this trend and decides that the graph looks
like a fan. I don’t know, I get more wings vibes.

This is all to say that, at least from the 70s-90s, utility load growth
estimates were reliably biased upwards. Now, this isn’t to knock the utilities
too much. Forecasting is hard and in power systems you generally want to be
conservative, which means erring on the side of being prepared for more load
growth. But if we know there’s a consistent bias in utility forecasts – we’d
want to know[^1]. But is it still true? I couldn’t find any modern versions of
the NERC fan.

The Rocky Mountain Institute (RMI) did answer this question for *peak load* in
[this excellent
writeup](https://rmi.org/billion-dollar-costs-forecasting-electricity-demand/):
from 2005 to 2015 (excluding 2009 and 2010 for recessiony reasons). They found
that planners roughly overforecast peak load by 1% for every year they’re
looking ahead, so 5 year forecasts are on average 5% too high and 10 year are
\+10%. If you just want the short answer and are okay missing the last decade of
data, you can probably stop reading. But if you want to see lots of graphs\!
Read ahead.

The main problem with the RMI report: no fan chart\! And 2015 was nearly a
decade ago. What to do?

!["To wake, to rise--perchance, to grind."](tweet1.jpeg "perchance")  

I just really wanted to see this same picture in the modern age, so I pulled
NERC’s Electricity Supply and Demand database and set to work. This contains
actual “net energy load” (NEL) and a 10 year projection from each NERC region
each year from 1997-2023. The fact that it also contains 10 year projections
tells me it’s something like the source used for the original NERC fan.

So this is what I came up with.

{% extra_large_fig %}
![The modern NERC fan](modern_nerc_fan.png "Data visualization is my passion")
{% endextra_large_fig %}

I also made the same graph with the actual and projected peak summer demand, which I might argue is more relevant for grid planning (equivalently, winter peak in some regions).

{% large_fig %}
![NERC Fan but for peak summer demand](summer_peak_hour_demand_fan.png "I stole the colors from the FT")
{% endlarge_fig %}

A couple things worth mentioning. Clearly, something is off with the total
aggregated US NEL/peak summer demand. There’s a weird drop in 2013 that I can’t
find replicated elsewhere, the US Energy Information Administration (EIA)
[reports fairly steady nationwide electricity consumption during that
period](https://www.eia.gov/international/data/world/electricity/electricity-consumption?pd=2&p=0000002&u=0&f=A&v=line&a=-&i=none&vo=value&vb=33&t=C&g=none&l=249--238&s=315532800000&e=1672531200000&ev=true).
So I think this is best interpreted as simply the sum of NERC region’s NELs –
which themselves might be idiosyncratic (primarily regions change and break
apart[^2]) and have reporting artifacts. Something clearly happened with the
reporting in 2013, and it’s likely that wasn’t factored into the forecasts. I
would treat this as a best-effort visualization of the data available in the
NERC database and not much more. Enough to illustrate a trend (maybe), but
definitely not clean enough to measure anything. We also see what I think is
probably some sort of data error with the NEL forecast starting in 2014\. I
believe it’s a data error in MISO’s reported projections and emailed NERC about it, but no one’s gotten back to me[^3].

With that out of the way, what are we roughly seeing here? Well, we see a fan\! Starting in 2000 particularly. Before then, utility estimates actually seem low. Afterwards, generally too high.

I’d guess this data needs more cleaning, and I’d need to understand better how NERC collects this data before I’d swear by my analysis.  Particularly, it’s clear that reporting regions change, disappear, or experience large swings in reported load that are likely exogenous to actual energy usage patterns (e.g. a state joining or leaving an RTO). Check out the same NEL graph but broken down by NERC reporting region (limited to US, some regions report for multiple countries??)

{% extra_large_fig %}
![Net energy for load but for each NERC reporting region](nel_by_region.png "what's going on here")
{% endextra_large_fig %}

So that all seems a bit weird. But there’s a clear pattern here we can gut check using other data. Another fairly comprehensive source is the EIA’s electricity sales data. I’ll be honest I don’t quite know where they get their data, but they label theirs as explicitly “electricity sales”. I believe NEL accounts for losses whereas sales don’t, so hopefully these rely on slightly different reporting but should track very closely. Regardless, here is the EIA’s description of electricity sales projects against real sales, in table form.

{% extra_large_fig %}
![Same story different data](eia_data.png "Energy Information Administration data")
{% endextra_large_fig %}
  
[Source](https://www.eia.gov/outlooks/aeo/retrospective/pdf/Table_16.pdf)

We see a very similar pattern\! Forecasts from the 90s tend to underpredict (green), forecasts since then tend to overpredict (blue). Nice\!

While I was working (read: procrastinating) this post, someone else…just…tweeted it out.  

{% raw %}
<blockquote class="twitter-tweet"><p lang="en" dir="ltr">I...worked on this story for a year...and...he just...he tweeted it out.</p>&mdash; Jared Yates Sexton (@JYSexton) <a href="https://twitter.com/JYSexton/status/884798748152483840?ref_src=twsrc%5Etfw">July 11, 2017</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
{% endraw %}

The person in question is the prolific energy poster Shanu Matthew.   
{% raw %}
<blockquote class="twitter-tweet"><p lang="en" dir="ltr">&quot;Skepticism over electricity demand forecasts is warranted. For decades, utilities and grid operators have over-forecast load as the industry has underestimated the impacts of energy efficiency improvements and shifts in industrial activity that pushed power demand below… <a href="https://t.co/7VLcTvzme7">pic.twitter.com/7VLcTvzme7</a></p>&mdash; Shanu Mathew (@ShanuMathew93) <a href="https://twitter.com/ShanuMathew93/status/1869051072293298501?ref_src=twsrc%5Etfw">December 17, 2024</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
{% endraw %}

The chart attached here is from a [report by Standard and Poor](https://www.spglobal.com/en/research-insights/special-reports/look-forward/ai-and-energy) (yes the rating agency) on AI related datacenter demand. I didn’t know S\&P did much other than put together the eponymous 500, but it’s a remarkably clear eyed report. I recommend giving it a read, especially as it calls out the huge range of datacenter growth estimates published. They use the same EIA data and plot it out for the 2000s

![NERC Fan from electricity sales projections](sp_chart.png "")

And we see the same trend again\! 

I want to emphasize, as it pertains to utilities, I don’t see this as damning at all. If you are going to err, you probably want to err conservatively. But I think it’s a systemic enough bias that it’s worth mentioning as we consider utility projections of load growth.

The data used in this analysis can be found [on NERC's website here.](https://www.nerc.com/pa/RAPA/ESD/Pages/default.aspx)  
The code for generating these plots can be found as an admittedly messy[^4]
Jupyter notebook at this Github Repo: [github.com/stevenrchun/NERCFan](https://github.com/stevenrchun/NERCFan)

*Thanks to Erin M. and Ellery C. for reviewing earlier versions of this post.*


## Notes
<!-- Footnotes themselves at the bottom. -->

[^1]:  Note: just because utilities have been sort of aggressive with their load forecasts, that doesn’t necessarily mean they’re going to be similarly aggressive with datacenter forecasts. I think there are other good reasons to believe that to be true, but I recognize that utility forecasts may not exhibit consistent bias between the last 10 years and the next couple years, if datacenter loads and *hand wave* AI really upend where load growth comes from.

[^2]:  Example of this sort of change: “Former Southwest Power Pool (SPP)
    members Associated Electric Cooperative, Inc., Entergy Corporation, and
    Cajun Electric Power Cooperative are now reporting in the SERC Region. Former SPP member St. Joseph Light and Power Company is now reporting in the MAPP Region. All future and historical statistics stated herein are based on the omission of data for these four companies. The peak demand of SPP has been reduced by approximately 38% as a result of the departure of these former members." from the [1998 NERC Reliability assessment](https://www.nerc.com/pa/RAPA/ra/Reliability%20Assessments%20DL/98ras.pdf).

[^3]:  This is what I sent: “I've been poking around the ES\&D database and one
    potential error caught my eye: in MISO's 2014 annual net energy for load
    report they report 401,778 GWh of expected NEL. The next forecasted year,
    2015, however the forecast jumps up to 678,295 GWh. Furthermore, the actual
    load for 2014 was 662,636.30 GWh, much more in the range of the 2015 estimate rather than the 2014 estimate. This makes me suspect either some reporting artifact or data error.

[^4]:  Among the things that are messy is a ton of extra dependencies because I briefly used this notebook as a way to plot my favorite pub on a census map of San Francisco for a bit. So no, my NERC graphs don’t rely on geopandas, if you were wondering. 
