#!/bin/bash
<<<<<<< HEAD
pid=`adb shell pidof ru.baikalweb.gruz`
adb logcat --pid=$pid
=======
script_name=`adb shell pidof ru.baikalweb.gruz`
adb logcat --pid=$script_name
>>>>>>> bitb/b27_screens
