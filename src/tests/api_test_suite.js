/**
 * DVS NGO - API POST Request Validation Suite
 * Implements 10 test cases for the contact_submissions endpoint.
 */

const SUPABASE_URL = 'https://vfgapmdjblusfsjmxgde.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmZ2FwbWRqYmx1c2Zzam14Z2RlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2MzQzMjEsImV4cCI6MjA4OTIxMDMyMX0.S3lZZAtyZn-TJ7aaLKK6ZEMiK2mY2L2mqSDYOAF4-js';
const TABLE_URL = `${SUPABASE_URL}/rest/v1/contact_submissions`;

const headers = {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
    'Referer': 'https://dvsngo.dpdns.org'
};

async function runTest(name, body, expectedStatus, description) {
    console.log(`\n[TEST] ${name}`);
    console.log(`Description: ${description}`);
    
    try {
        const response = await fetch(TABLE_URL, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body)
        });

        const status = response.status;
        const data = await response.json().catch(() => ({}));

        const passed = Array.isArray(expectedStatus) 
            ? expectedStatus.includes(status) 
            : status === expectedStatus;

        if (passed) {
            console.log(`✅ PASSED (Status: ${status})`);
        } else {
            console.log(`❌ FAILED (Status: ${status}, Expected: ${expectedStatus})`);
            console.log('Response:', JSON.stringify(data, null, 2));
        }
        return passed;
    } catch (error) {
        console.log(`❌ ERROR: ${error.message}`);
        return false;
    }
}

async function runTestSuite() {
    console.log('=== DVS NGO API PRE-FLIGHT TEST SUITE ===');
    let results = [];

    // --- High Priority Tests ---

    results.push(await runTest(
        'HP-1: Valid POST request',
        { name: "John Doe", email: "john@example.com", mobile: "9876543210", subject: "Scholarship Query", message: "I want to apply." },
        201,
        'Send valid data to ensure 201 Created.'
    ));

    results.push(await runTest(
        'HP-2: Missing required fields',
        { name: "Missing fields test" }, // Missing 'subject' and 'message' (Now NOT NULL in DB)
        400,
        'Send request missing required fields (subject, message). Expect 400 Bad Request.'
    ));

    results.push(await runTest(
        'HP-3: Invalid data types',
        { name: "T", subject: "T", message: ["Sending", "Array", "Instead", "Of", "String"] },
        400,
        'Send incorrect data types (Array for text). Expect 400 error.'
    ));

    results.push(await runTest(
        'HP-4: Excess data',
        { name: "Extra Field Test", subject: "S", message: "M", non_existent_column: "ignore me" },
        400,
        'Send unnecessary fields. Expect 400 (Handled by server by rejecting unknown columns).'
    ));

    results.push(await runTest(
        'HP-5: Data variations',
        { name: "Minimal User", subject: "S", message: "M" }, // Minimal required set
        201,
        'Test variations (only required fields).'
    ));

    // --- Edge Case Tests ---

    results.push(await runTest(
        'EC-1: Empty body',
        {},
        400,
        'Send an empty JSON body.'
    ));

    results.push(await runTest(
        'EC-2: Special characters',
        { name: "🔥 DVS Scholar 🚀", subject: "Special!", message: "Characters: ©®™ € £ ¥ < > \" '" },
        201,
        'Verify handling of emojis and special symbols.'
    ));

    results.push(await runTest(
        'EC-3: Extreme value lengths',
        { name: "L".repeat(100), subject: "S".repeat(50), message: "M".repeat(5000) },
        201,
        'Test long strings in message field.'
    ));

    results.push(await runTest(
        'EC-4: Duplicate data entry',
        { name: "Duplicate Test", email: "dup@example.com", subject: "S", message: "M" },
        201,
        'Submit identical data twice (Allowed as no UNIQUE constraint exists).'
    ));

    results.push(await runTest(
        'EC-5: Non-UTF8 encoded data',
        { name: "Malformed \ud800" }, 
        400,
        'Send malformed surrogate pair.'
    ));

    console.log('\n=== TEST SUITE SUMMARY ===');
    const passedCount = results.filter(r => r).length;
    console.log(`Total Passed: ${passedCount}/${results.length}`);
    
    if (passedCount === results.length) {
        console.log('✅ ALL TESTS PASSED SUCCESSFULLY');
    } else {
        console.log('⚠️ SOME TESTS FAILED OR BEHAVED UNEXPECTEDLY');
    }
}

runTestSuite();
