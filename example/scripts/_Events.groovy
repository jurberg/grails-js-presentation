import org.codehaus.groovy.grails.test.junit4.JUnit4GrailsTestType

includeTargets << new File("scripts/_JavaScriptTasks.groovy")

eventTestPhasesStart = { phasesToRun ->
    phasesToRun << "jslint"
    phasesToRun << "jasmine"
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

