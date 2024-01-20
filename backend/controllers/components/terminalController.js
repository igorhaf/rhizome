exports.sendCommand = async (req, res) => {
    const command = req.body.command;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            return res.status(500).send({ error: stderr });
        }
        res.send({ output: stdout });
    });
};
