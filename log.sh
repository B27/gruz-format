#!/bin/bash
script_name=`adb shell pidof ru.baikalweb.gruz`
adb logcat --pid=$script_name