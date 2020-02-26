export default {
    INJECTION_ERROR: (injectedProperties: string[]) => `Error injecting one or more of the following properties ${injectedProperties.join(',')}`
}