java -jar scripts/lib/JSCover-all.jar -ws --branch --no-instrument=test/spec --no-instrument=scripts/lib --no-instrument=web-app/js/lib --report-dir=target/test-reports --port=3000 &
open http://localhost:3000/jscoverage.html?url=test/spec/TestRunner.html
