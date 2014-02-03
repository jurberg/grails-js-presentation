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

target(runJsTests: 'Runs Jasmine Tests') {

    def specDir = "test/spec"
    def targetDir = "target/test-reports"
    def testResourcesDir = "scripts/lib"
    def phantomDir = System.getProperty("phantomDir") ?: ""

    event("StatusUpdate", ["Starting Jasmine test phase"])

    def specsToRun = []
    new File(specDir).eachFileRecurse {
        if (it.name.endsWith(".html")) {
            specsToRun << it
        }
    }

    def startTime = new Date()
    def failures = 0
    def buildPassed = true

    specsToRun.each { File spec ->
        event("StatusUpdate", ["Running ${spec.name}..."])
        def outputFile = "${targetDir}/plain/TEST-${spec.name.replace('-', '').replace('.html', '.txt')}"
        def ant = new AntBuilder()
        ant.exec(outputproperty: "cmdOut", errorproperty: "cmdErr", resultproperty: "cmdExit", failonerror: "false", executable: "${phantomDir}phantomjs") {
            arg(line: "\"${testResourcesDir}/phantomjs_jasminexml_runner.js\"")
            arg(line: "\"${specDir}/${spec.name}\"")
            arg(line: "\"${targetDir}\"")
        }
        if (ant.project.properties.cmdExit != "0") {
            buildPassed = false
            event("StatusError", ["${spec.name} FAILED!  View results in ${outputFile}"])
            failures++
        } else {
            event("StatusUpdate", ["${spec.name} PASSED"])
        }
        new File(outputFile).write(ant.project.properties.cmdOut)
        event("StatusUpdate", [ant.project.properties.cmdOut])
    }

    event("StatusUpdate", ["Jasmine Tests Completed in ${new Date().getTime() - startTime.getTime()}ms"])
    event("${buildPassed ? 'StatusFinal' : 'StatusError'}", ["Jasmine Tests ${buildPassed ? 'PASSED' : 'FAILED'} - view results in ${targetDir}/plain"])
    if (!buildPassed) {
        Ant.fail(message: "Jasmine Tests failed", status: 1)
    }

}
