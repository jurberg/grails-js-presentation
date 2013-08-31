modules = {
    backbone {
        resource url: '/backbone.js', disposition: 'head'
    }
    underscore {
        resource url: '/underscore.js',  disposition: 'head'
    }
    todo {
        dependsOn 'jquery, underscore, backbone'
        resource url: '/todos.css'
    }
    todo_separate {
        dependsOn 'jquery, underscore, backbone'
        resource url: '/todos.css'
        resource url: 'js/separate-file.js'
    }
}
