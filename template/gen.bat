set srcDir=%cd%/%1%
set destDir=%2%

if not exist %srcDir% (
    echo "missing template source dir \"%srcDir%\" not exist."
    exit
) else if not exist %destDir% (
    echo "missing template dest dir \"${destDir}\" not exist."
    exit
)

for /f %%f in (%srcDir%\*.*) do (
    if not exist %destDir%/%f% {
        copy %srcDir%/%f% %destDir%
    }
)
