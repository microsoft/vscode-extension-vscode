import * as cp from 'child_process'

export function runTests(
  vscodeExecutablePath: string,
  extPath: string,
  testPath: string,
  testWorkspace: string
): Promise<number> {
  return new Promise((resolve, reject) => {
    const args = [
      testWorkspace,
      '--extensionDevelopmentPath=' + extPath,
      '--extensionTestsPath=' + testPath,
      '--locale=en'
    ]

    const cmd = cp.spawn(vscodeExecutablePath, args)

    cmd.stdout.on('data', function(data) {
      const s = data.toString()
      if (!s.includes('update#setState idle')) {
        console.log(s)
      }
    })

    cmd.on('error', function(data) {
      console.log('Test error: ' + data.toString())
    })

    cmd.on('close', function(code) {
      console.log(`Exit code:   ${code}`)

      if (code !== 0) {
        reject('Failed')
      }

      console.log('Done\n')
      resolve(code)
    })
  })
}
