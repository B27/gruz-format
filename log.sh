#!/bin/bash
pid=`adb shell pidof ru.baikalweb.gruz`
adb logcat --pid=$pid
