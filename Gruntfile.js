module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        concat: {
            front: {
                src: ["src/front/front_core.js", "src/front/modules/**/*.js"],
                dest: "dist/console_front.js"
            },
            bootstrap: {
                src: ["src/bootstrap/bootstrap_core.js", "src/bootstrap/modules/**/*.js"],
                dest: "dist/console_bootstrap.js"
            }
        },
        uglify: {
            console: {
                files: {
                    "dist/console_front.min.js": ["dist/console_front.js"],
                    "dist/console_bootstrap.min.js": ["dist/console_bootstrap.js"]
                }
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-uglify");

    grunt.registerTask("default", ["concat", "uglify:console"]);
};
