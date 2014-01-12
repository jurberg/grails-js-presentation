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
