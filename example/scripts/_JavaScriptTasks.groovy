includeTargets << grailsScript('_GrailsPackage')

target(runJSLint: 'Runs JSLint') {
    depends(createConfig)

    if (config.jstest.jslint.disable) {
        ant.echo "JSLint phase disabled"
        return
    }

    def testResourcesDir = "scripts/lib"
    def phantomDir = System.getProperty("phantomDir") ?: ""
    def errorFile = "target/test-reports/jslint-errors.log"
    def lintFile = "${testResourcesDir}/LintConfig.js"
    def filepaths = config.jstest.jslint.filepaths ?: "'web-app/js/','test/spec/'"
    def exclusions = config.jstest.jslint.exclusions ?: "'web-app/js/lib/','test/spec/lib/'"

    ant.echo "Starting JSLint phase"

    // inject settings into the lint config
    ant.copy(file: "${testResourcesDir}/_LintConfig.js", tofile: "${lintFile}", overwrite: true)
    ant.replace(file: "${lintFile}", token: "{filepaths}", value: "${filepaths}")
    ant.replace(file: "${lintFile}", token: "{exclusions}", value: "${exclusions}")

    ant.exec(outputproperty: "cmdOut", errorproperty: "cmdErr", resultproperty: "cmdExit", failonerror: "false", executable: "${phantomDir}phantomjs") {
        arg(line: "\"${lintFile}\"")
    }

    def buildPassed = (ant.project.properties.cmdExit == "0")
    if (!buildPassed) {
        new File(errorFile).eachLine { line ->
            ant.echo line
        }
        ant.echo "JSLint FAILED -- View results in ${errorFile}"
        ant.fail(message: "JSLINT failed.", status: 1)
    } else {
        ant.echo "JSLint PASSED"
    }
}

target(runJsTests: 'Runs Jasmine Tests') {

    def specDir = "test/spec"
    def targetDir = "target/test-reports"
    def testResourcesDir = "scripts/lib"
    def phantomDir = System.getProperty("phantomDir") ?: ""

    ant.echo "PhantomJS dir: ${phantomDir}"
    ant.echo "Starting Jasmine test phase"

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
        ant.echo "Running ${spec.name}..."
        def outputFile = "${targetDir}/plain/TEST-${spec.name.replace('-', '').replace('.html', '.txt')}"
        def ant = new AntBuilder()
        ant.exec(outputproperty: "cmdOut", errorproperty: "cmdErr", resultproperty: "cmdExit", failonerror: "false", executable: "${phantomDir}phantomjs") {
            arg(line: "\"${testResourcesDir}/phantomjs_jasminexml_runner.js\"")
            arg(line: "\"${specDir}/${spec.name}\"")
            arg(line: "\"${targetDir}\"")
        }
        if (ant.project.properties.cmdExit != "0") {
            buildPassed = false
            ant.echo "${spec.name} FAILED!  View results in ${outputFile}"
            failures++
        } else {
            ant.echo "${spec.name} PASSED"
        }
        new File(outputFile).write(ant.project.properties.cmdOut)
    }

    ant.echo "Jasmine Tests Completed in ${new Date().getTime() - startTime.getTime()}ms"

    ant.echo "Jasmine Tests ${buildPassed ? 'PASSED' : 'FAILED'} - view results in ${targetDir}/plain"
    if (!buildPassed) {
        Ant.fail(message: "Jasmine Tests failed", status: 1)
    }

}

target(runJsCover: 'Runs JSCover Coverage Report') {
    depends(createConfig)

    def specDir = "test/spec"
    def targetDir = "target/test-reports"
    def testResourcesDir = "scripts/lib"
    def phantomDir = System.getProperty("phantomDir") ?: ""
    def coveragePort = (config.jstest.coverage.port ?: 3000) as int
    def exclusions = config.jstest.coverage.exclusions ?: []

    ant.echo "PhantomJS dir: ${phantomDir}"
    ant.echo "Starting JSCover Coverage phase"

    def specsToRun = []
    new File(specDir).eachFileRecurse {
        if (it.name.endsWith(".html")) {
            specsToRun << it
        }
    }

    def startTime = new Date()
    def failCount = 0

    // just in case...
    Ant.get(src: "http://localhost:${coveragePort}/stop", dest: "${targetDir}/stop.txt", ignoreerrors: "true")

    // start the coverage server
    ant.echo "Starting the coverage server..."
    Ant.java(jar: "${testResourcesDir}/JSCover-all.jar", fork: "true", spawn: "true") {
        arg(line: "-ws")
        arg(line: "--branch")
        arg(line: "--no-instrument=${specDir}")
        exclusions.each {
            arg(line: "--no-instrument=${it}")
        }
        arg(line: "--report-dir=${targetDir}")
        arg(line: "--port=${coveragePort}")
    }

    Ant.waitfor(maxwait: 15, maxwaitunit: "second", checkevery: "250", checkeveryunit: "millisecond", timeoutproperty: "failed") {
        http(url: "http://localhost:${coveragePort}/jscoverage.html")
    }

    Ant.fail(if: "failed")

    // run each of the specs on the server
    specsToRun.each { File spec ->
        ant.echo "Running ${spec.name}..."

        // Run the tests with coverage
        Ant.exec(outputproperty: "cmdOut", errorproperty: "cmdErr", resultproperty: "cmdExit", failonerror: "false", executable: "${phantomDir}phantomjs") {
            arg(line: "${testResourcesDir}/run-jscover-jasmine.js")
            arg(line: "http://localhost:${coveragePort}/${specDir}/${spec.name}")
        }
        ant.echo ant.project.properties.cmdOut
        if (ant.project.properties.cmdExit != "0") {
            failCount++
        }

        // generate the coverage report
        Ant.java(classpath: "${testResourcesDir}/JSCover-all.jar", classname: "jscover.report.Main") {
            arg(line: "--format=COBERTURAXML")
            arg(line: "${targetDir}/phantom")
            arg(line: "${basedir}")
        }

        // rename the file
        Ant.rename(src: "${targetDir}/phantom/cobertura-coverage.xml", dest: "${targetDir}/phantom/${spec.name}-coverage.xml")
    }

    // stop the server
    Ant.get(src: "http://localhost:${coveragePort}/stop", dest: "${targetDir}/stop.txt")

    ant.echo "Coverage Completed in ${new Date().getTime() - startTime.getTime()}ms"
    if (failCount > 0) {
        Ant.fail(message: "JavaScript Coverage tests failed", status: 1)
    }

}
