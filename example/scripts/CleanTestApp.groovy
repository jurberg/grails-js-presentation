includeTargets << grailsScript("_GrailsClean")
includeTargets << grailsScript("RefreshDependencies")
includeTargets << grailsScript("TestApp")

target(cleanTestApp: "Clean, refresh dependencies, then test app") {
    depends(cleanAll, refreshDependencies, 'default')
}

setDefaultTarget("cleanTestApp")