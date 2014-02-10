import org.codehaus.groovy.grails.test.junit4.JUnit4GrailsTestType

includeTargets << new File("scripts/_JavaScriptTasks.groovy")

eventTestPhasesStart = { phasesToRun ->
    phasesToRun << "jslint"
    phasesToRun << "jasmine"
    phasesToRun << "jscover"
}

jslintTests = [new JUnit4GrailsTestType("jslint", "spec")]
jslintTestPhasePreparation = {
    runJSLint()
}
jslintTestPhaseCleanUp = {}

jasmineTests = [new JUnit4GrailsTestType("jasmine", "spec")]
jasmineTestPhasePreparation = {
    runJsTests()
}
jasmineTestPhaseCleanUp = {}

jscoverTests = [new JUnit4GrailsTestType("jscover", "spec")]
jscoverTestPhasePreparation = {
    runJsCover()
}
jscoverTestPhaseCleanUp = {}

eventCreateWarStart = {warName, stagingDir ->
    def curDir = new File('Scripts')
    ant.exec(outputproperty: "cmdOut", errorproperty: "cmdErr", resultproperty: "cmdExit", failonerror: "false", executable: "java") {
        arg(line: "-cp ${new File(curDir, 'js.jar').absolutePath}")
        arg(line: "org.mozilla.javascript.tools.shell.Main")
        arg(line: "${new File(curDir, 'r.js').absolutePath}")
        arg(line: "-o")
        arg(line: "name=bootstrap")
        arg(line: "baseUrl=${stagingDir}/js")
        arg(line: "out=${stagingDir}/js/bootstrap-build.js")
    }
    println ant.project.properties.cmdOut
}
