modules = {
    backbone {
        resource url: '/js/backbone.js', disposition: 'head'
    }
    underscore {
        resource url: '/js/underscore.js',  disposition: 'head'
    }
    todo {
        dependsOn 'jquery, underscore, backbone'
        resource url: '/css/todos.css'
        resource url: '/js/todos.js'
    }
}
