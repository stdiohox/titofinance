/**
 * Shared plumbing for the landing-page lead forms.
 *
 * The endpoint lives here rather than being retyped per page. It is already
 * duplicated across Stock101Page.tsx and LandingForm.tsx; those two are left
 * alone for now, but any new form imports from here so the count stops
 * growing. Rotating the Apps Script deployment should eventually be a
 * one-line change.
 */

/** The Google Apps Script ingest endpoint. Same one both live forms post to. */
export const INGEST_ENDPOINT =
  'https://script.google.com/macros/s/AKfycbxS_n6QvCVS_BkgGTuQCAphOIpEV89gU4YO7RtDhdwEGf0v8ipOC7xVMpaMOHNu8EvgVg/exec'

/** Tito's direct line, for the fallback when a submission fails. */
export const WHATSAPP_DIRECT = 'https://wa.me/2349064491583'

/** The free community group, offered after a successful submission. */
export const WHATSAPP_GROUP =
  'https://chat.whatsapp.com/LGD9xagBy2Y4PjF7BCdp2n?mode=gi_t'

export type FormType = 'beginner_portfolio' | 'closed_group'

export interface SubmitResult {
  ok: boolean
  error?: string
}

/**
 * Posts a lead and TELLS YOU WHETHER IT WORKED.
 *
 * The existing two forms use `mode: 'no-cors'`, which makes the response
 * opaque - status, headers and body are all unreadable - and then set their
 * success flag inside the catch as well as the try. The result is that an
 * outage, a rate limit or a 500 is indistinguishable from success: the
 * visitor sees the thank-you screen and the lead is gone with no trace
 * anywhere. This function exists so the two new forms do not inherit that.
 *
 * WHY text/plain FOR A JSON BODY. Dropping no-cors makes this a real CORS
 * request, and an `application/json` content type triggers a preflight OPTIONS
 * that Apps Script cannot answer. `text/plain;charset=utf-8` keeps it a
 * "simple" request, so the browser skips the preflight and the response
 * becomes readable. The body is still JSON and the script still parses it the
 * same way. This is the same trick the CRM's Sheets sync already uses, and it
 * is the reason that one can report a real failure while these forms could
 * not.
 */
export async function submitLead(payload: Record<string, unknown>): Promise<SubmitResult> {
  try {
    const res = await fetch(INGEST_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      return { ok: false, error: `The server returned ${res.status}.` }
    }

    // A success flag in the body is the only real confirmation. A 200 with an
    // HTML error page is exactly what Apps Script returns when a deployment is
    // wrong, and that must not read as success.
    const body = (await res.json().catch(() => null)) as { success?: boolean } | null

    if (body?.success === false) {
      return { ok: false, error: 'The form was received but could not be saved.' }
    }
    if (body === null) {
      return { ok: false, error: 'The server sent an unexpected response.' }
    }

    return { ok: true }
  } catch {
    return { ok: false, error: 'Could not reach the server. Check your connection.' }
  }
}
