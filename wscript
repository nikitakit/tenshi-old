#!/usr/bin/env python
from __future__ import print_function


def recurse(ctx):
    ctx.recurse('eda', mandatory=False)
    ctx.recurse('controller', mandatory=False)
    ctx.recurse('smartsensor_fw', mandatory=False)


def options(ctx):
    recurse(ctx)


def configure(ctx):
    ctx.env['root'] = ctx.path.abspath()
    recurse(ctx)


def build(ctx):
    recurse(ctx)
