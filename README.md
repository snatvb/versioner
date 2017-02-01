# Versioner
## Welcome to auto versions your projects!

I want show you, how I can update versions, it's so simple!
You must install me, write to console 

`npm i -g versioner-snatvb`

If you got error, use sudo with npm.

So, now you must just move to your project in terminal, where you keep own project.
There should be package.json

Are you here? Okay, just write to console `versioner`
I will ask your platform, it must be one symbol
* i - iOS
* A - Android
* B - web browser
* M - desktop MacOS
* W - desktop Windows
* S - server side
It's simple, so?

Go next, I think you know how to use **git**.
Just write to console: 

`versioner git "My first commit with tag"`

Everything! All ready!
You create commit with tag your version

If you want add "**--rc**" to tag, just write 

`verioner --rc git "My first commit rc version with tag"`

If you want right away push your commit, use "**--push**"

`verioner --rc --push git "My first commit rc version with tag"`

Do you want upgrade version? Yes? Okay.
Write to console as following 
`verioner --minor`
Done. You upgrade your project on 0.0.1 version.
Exist *--minor*, *--core* and *--major* upgrade.
They have format: "MAJOR.CORE.MINOR"
You can use it.

Tanks!
