import React from 'react';

const getLineDiff = (oldText: string, newText: string) => {
    const oldLines = oldText.split('\n');
    const newLines = newText.split('\n');

    const maxLength = Math.max(oldLines.length, newLines.length);
    const diffArray: { oldLine: string | null, newLine: string | null }[] = [];

    for (let i = 0; i < maxLength; i++) {
        diffArray.push({
            oldLine: oldLines[i] || null,
            newLine: newLines[i] || null,
        });
    }
    return diffArray;
};

// Function to compute the Longest Common Subsequence (LCS) between two strings
const computeLCS = (oldLine: string, newLine: string) => {
    const lenOld = oldLine.length;
    const lenNew = newLine.length;
    const dp = Array(lenOld + 1).fill(null).map(() => Array(lenNew + 1).fill(0));

    for (let i = 1; i <= lenOld; i++) {
        for (let j = 1; j <= lenNew; j++) {
            if (oldLine[i - 1] === newLine[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }

    let i = lenOld, j = lenNew;
    const lcs = [];

    // Backtrack to find LCS
    while (i > 0 && j > 0) {
        if (oldLine[i - 1] === newLine[j - 1]) {
            lcs.unshift(oldLine[i - 1]);
            i--;
            j--;
        } else if (dp[i - 1][j] > dp[i][j - 1]) {
            i--;
        } else {
            j--;
        }
    }
    return lcs.join('');
};

const highlightDiff = (oldLine: string | null, newLine: string | null) => {
    const result: { text: string; type: string }[] = [];

    if (!oldLine && newLine) {
        return [{ text: newLine, type: 'added' }];
    }

    if (oldLine && !newLine) {
        return [{ text: oldLine, type: 'removed' }];
    }

    const lcs = computeLCS(oldLine || '', newLine || '');
    let oldIdx = 0, newIdx = 0;

    for (let i = 0; i < lcs.length; i++) {
        while (oldLine?.[oldIdx] !== lcs[i] && oldIdx < oldLine.length) {
            result.push({ text: oldLine[oldIdx], type: 'removed' });
            oldIdx++;
        }
        while (newLine?.[newIdx] !== lcs[i] && newIdx < newLine.length) {
            result.push({ text: newLine[newIdx], type: 'added' });
            newIdx++;
        }
        result.push({ text: lcs[i], type: 'same' });
        oldIdx++;
        newIdx++;
    }

    // Push remaining characters
    while (oldIdx < oldLine.length) {
        result.push({ text: oldLine[oldIdx], type: 'removed' });
        oldIdx++;
    }
    while (newIdx < newLine.length) {
        result.push({ text: newLine[newIdx], type: 'added' });
        newIdx++;
    }

    return result;
};

const DiffViewer = ({ oldText, newText }: { oldText: string; newText: string }) => {
    const diffResult = getLineDiff(oldText, newText);

    return (
        <div className="diff-viewer">
            {/* Old File */}
            <div className="diff-column">
                <h3>Old Generated File</h3>
                <div className="diff-container">
                    <div className="line-numbers">
                        {diffResult.map((_, index) => (
                            <div key={index} className="line-number">{index + 1}</div>
                        ))}
                    </div>
                    <pre className="diff-content">
                        {diffResult.map((line, index) => (
                            <div key={index} className='diff-line'>
                                <div className={line.oldLine !== line.newLine ? 'old-line' : ''}>
                                    {highlightDiff(line.oldLine, line.newLine)
                                        .filter(part => part.type !== 'added')
                                        .map((part, idx) => (
                                            <span key={idx} className={part.type === 'removed' ? 'removed' : ''}>
                                                {part.text}
                                            </span>
                                        ))}
                                </div>
                            </div>
                        ))}
                    </pre>
                </div>
            </div>
            {/* New File */}
            <div className="diff-column">
                <h3>New Generated File</h3>
                <div className="diff-container">
                    <div className="line-numbers">
                        {diffResult.map((_, index) => (
                            <div key={index} className="line-number">{index + 1}</div>
                        ))}
                    </div>
                    <pre className="diff-content">
                        {diffResult.map((line, index) => (
                            <div key={index} className='diff-line'>
                                <div className={line.oldLine !== line.newLine ? 'new-line' : ''}>
                                    {highlightDiff(line.oldLine, line.newLine)
                                        .filter(part => part.type !== 'removed')
                                        .map((part, idx) => (
                                            <span key={idx} className={part.type === 'added' ? 'added' : ''}>
                                                {part.text}
                                            </span>
                                        ))}
                                </div>
                            </div>
                        ))}
                    </pre>
                </div>
            </div>
        </div>
    );
};

export default DiffViewer;