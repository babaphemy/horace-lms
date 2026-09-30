"use client"

import { PlaygroundToolId, ToolProps } from "@/data/labs"
import { labFixtures } from "@/data/labs/security-plus/fixtures"
import {
  Alert,
  Box,
  Button,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material"
import { useState } from "react"

type State = Record<string, unknown>
const labels: Record<PlaygroundToolId, { title: string; prompt: string }> = {
  hash: {
    title: "Hash workbench",
    prompt: "Enter text to hash locally with SHA-256.",
  },
  crypto: {
    title: "Crypto workbench",
    prompt: "Record encryption, signature, and tamper-test results.",
  },
  cert: {
    title: "Certificate inspector",
    prompt: "Select a fixture and diagnose its trust or identity issue.",
  },
  packets: {
    title: "Packet timeline",
    prompt: "Filter the pre-parsed packets and record tagged IOCs.",
  },
  logs: {
    title: "Log explorer",
    prompt: "Search bundled logs with free text or field:value queries.",
  },
  detection: {
    title: "Detection builder",
    prompt: "Write rules, then record true and false positive counts.",
  },
  controls: {
    title: "Control classifier",
    prompt: "Classify scenario controls and explain your choices.",
  },
  network: {
    title: "Network policy tester",
    prompt: "Define zones and rules, then test a flow.",
  },
  iam: {
    title: "IAM access review",
    prompt: "Mark each identity keep, modify, or revoke with a reason.",
  },
  phishing: {
    title: "Phishing analyzer",
    prompt: "Inspect the plain-text message and record a verdict.",
  },
  tabletop: {
    title: "Ransomware tabletop",
    prompt: "Respond to each inject before continuing.",
  },
  forms: {
    title: "Security report builder",
    prompt: "Draft the structured report or plan required by this lab.",
  },
}

export default function PlaygroundTool({
  toolId,
  state,
  onChange,
  onResult,
}: ToolProps<State> & { toolId: PlaygroundToolId }) {
  const [busy, setBusy] = useState(false)
  const value = String(state.value || "")
  const output = String(state.output || "")
  const fixture = labFixtures[toolId]
  const run = async () => {
    setBusy(true)
    let nextOutput = value.trim()
    if (toolId === "hash") {
      const digest = await crypto.subtle.digest(
        "SHA-256",
        new TextEncoder().encode(value)
      )
      nextOutput = Array.from(new Uint8Array(digest))
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("")
    } else if (!nextOutput)
      nextOutput = "Completed with bundled Northwind Clinic fixture"
    const next = {
      ...state,
      value,
      output: nextOutput,
      completedAt: new Date().toISOString(),
    }
    onChange(next)
    onResult({
      tool: toolId,
      rule: "complete",
      passed: true,
      message: `${labels[toolId].title} checkpoint complete.`,
      data: next,
    })
    setBusy(false)
  }
  return (
    <Stack spacing={2}>
      <Box>
        <Typography variant="h6" fontWeight={900}>
          {labels[toolId].title}
        </Typography>
        <Typography color="text.secondary">{labels[toolId].prompt}</Typography>
      </Box>
      {Boolean(fixture) && (
        <Alert severity="info">
          Using a fictitious, bundled Northwind Clinic fixture. No traffic
          leaves this browser.
        </Alert>
      )}
      {Boolean(fixture) && (
        <Box
          component="pre"
          sx={{
            bgcolor: "#071f2a",
            color: "#d8f7f5",
            p: 2,
            borderRadius: 2,
            maxHeight: 220,
            overflow: "auto",
            whiteSpace: "pre-wrap",
            fontSize: 13,
          }}
        >
          {typeof fixture === "string"
            ? fixture
            : JSON.stringify(fixture, null, 2)}
        </Box>
      )}
      {toolId === "controls" || toolId === "iam" ? (
        <TextField
          select
          label="Decision"
          value={value}
          onChange={(event) =>
            onChange({ ...state, value: event.target.value })
          }
        >
          <MenuItem value="keep">Keep / correct</MenuItem>
          <MenuItem value="modify">Modify</MenuItem>
          <MenuItem value="revoke">Revoke / incorrect</MenuItem>
        </TextField>
      ) : (
        <TextField
          multiline
          minRows={5}
          label="Workbench input and findings"
          value={value}
          onChange={(event) =>
            onChange({ ...state, value: event.target.value })
          }
        />
      )}
      <Button variant="contained" onClick={run} disabled={busy}>
        {busy
          ? "Running locally…"
          : toolId === "hash"
            ? "Compute SHA-256"
            : "Run check"}
      </Button>
      {output && (
        <Alert severity="success" sx={{ overflowWrap: "anywhere" }}>
          {output}
        </Alert>
      )}
    </Stack>
  )
}
