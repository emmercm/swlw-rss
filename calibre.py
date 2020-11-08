#!/usr/bin/env python3

import re
from calibre.web.feeds.news import BasicNewsRecipe

class SoftwareLeadWeekly(BasicNewsRecipe):
    title            = 'Software Lead Weekly'
    description      = 'A weekly email for busy people who care about people, culture and leadership.'
    __author__       = 'Christian Emmer'
    language         = 'en'
    oldest_article   = 7
    publication_type = 'blog'
    timefmt          = ' [%d %B %Y]'
    feeds            = ['https://swlw-rss.netlify.app/latest.rss']
    encoding         = 'utf8'
    auto_cleanup     = False

    def __init__(self, options, log, progress_reporter):
        BasicNewsRecipe.__init__(self, options, log, progress_reporter)

        from contextlib import closing
        with closing(self.browser.open(self.feeds[0])) as r:
            feed = r.read().decode('utf-8')
            self.title = re.search('<title>(<!\[CDATA\[)?(.+?)(]]>)?</title>', feed, re.IGNORECASE).group(2)
