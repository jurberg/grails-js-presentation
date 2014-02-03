import org.codehaus.groovy.grails.test.junit4.JUnit4GrailsTestType

includeTargets << new File("scripts/_JavaScriptTasks.groovy")

eventTestPhasesStart = { phasesToRun ->
    phasesToRun << "jslint"
}

jslintTests = [new JUnit4GrailsTestType("jslint", "spec")]
jslintTestPhasePreparation = {
    runJSLint()
}
jslintTestPhaseCleanUp = {}
