includeTargets << grailsScript('_GrailsPackage')
includeTargets << grailsScript("_GrailsEvents")

target(runJSLint: 'Runs JSLint') {
    depends(createConfig)

    def phantomDir = System.getProperty("phantomDir") ?: ""
    def errorFile = "target/test-reports/jslint-errors.log"
    def lintFile = "scripts/lib/LintConfig.js"

    event("StatusUpdate", ["Starting JSLint phase"])

    ant.exec(outputproperty: "cmdOut", errorproperty: "cmdErr", resultproperty: "cmdExit", failonerror: "false", executable: "${phantomDir}phantomjs") {
        arg(line: "\"${lintFile}\"")
    }

    def buildPassed = (ant.project.properties.cmdExit == "0")
    if (!buildPassed) {
        new File(errorFile).eachLine { line ->
            event("StatusUpdate", [line])
        }
        event("StatusError", ["JSLint FAILED -- View results in ${errorFile}"])
        ant.fail(message: "JSLINT failed.", status: 1)
    } else {
        event("StatusFinal", ["JSLint PASSED"])
    }

}
