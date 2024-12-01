import React from 'react';

const getLineDiff = (oldText: string, newText: string) => {
    const oldLines = oldText.split('\n');
    const newLines = newText.split('\n');
    const diffArray: { oldLine: string | null; newLine: string | null }[] = [];

    let oldIdx = 0, newIdx = 0;

    while (oldIdx < oldLines.length || newIdx < newLines.length) {
        if (oldIdx < oldLines.length && newIdx < newLines.length) {
            if (oldLines[oldIdx] === newLines[newIdx]) {
                // Unchanged line
                diffArray.push({ oldLine: oldLines[oldIdx], newLine: newLines[newIdx] });
                oldIdx++;
                newIdx++;
            } else if (
                oldIdx + 1 < oldLines.length &&
                newLines[newIdx] === oldLines[oldIdx + 1]
            ) {
                // Line removed
                diffArray.push({ oldLine: oldLines[oldIdx], newLine: null });
                oldIdx++;
            } else if (
                newIdx + 1 < newLines.length &&
                oldLines[oldIdx] === newLines[newIdx + 1]
            ) {
                // Line added
                diffArray.push({ oldLine: null, newLine: newLines[newIdx] });
                newIdx++;
            } else {
                // Modified line
                diffArray.push({ oldLine: oldLines[oldIdx], newLine: newLines[newIdx] });
                oldIdx++;
                newIdx++;
            }
        } else if (oldIdx < oldLines.length) {
            // Remaining old lines
            diffArray.push({ oldLine: oldLines[oldIdx], newLine: null });
            oldIdx++;
        } else if (newIdx < newLines.length) {
            // Remaining new lines
            diffArray.push({ oldLine: null, newLine: newLines[newIdx] });
            newIdx++;
        }
    }

    return diffArray;
};

// Function to compute the Longest Common Subsequence (LCS) between two strings
const computeLCS = (oldLine: string, newLine: string) => {
    const lenOld = oldLine?.length || 0;
    const lenNew = newLine?.length || 0;
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

    // Safely handle null values
    const safeOldLine = oldLine || '';
    const safeNewLine = newLine || '';

    const lcs = computeLCS(safeOldLine, safeNewLine);
    let oldIdx = 0, newIdx = 0;

    for (let i = 0; i < lcs.length; i++) {
        while (safeOldLine[oldIdx] !== lcs[i] && oldIdx < safeOldLine.length) {
            result.push({ text: safeOldLine[oldIdx], type: 'removed' });
            oldIdx++;
        }
        while (safeNewLine[newIdx] !== lcs[i] && newIdx < safeNewLine.length) {
            result.push({ text: safeNewLine[newIdx], type: 'added' });
            newIdx++;
        }
        result.push({ text: lcs[i], type: 'same' });
        oldIdx++;
        newIdx++;
    }

    if(oldIdx) {
        while (oldIdx < safeOldLine.length) {
            result.push({ text: safeOldLine[oldIdx], type: 'removed' });
            oldIdx++;
        }
    }
    
    if(newIdx) {
        while (newIdx < safeNewLine.length) {
            result.push({ text: safeNewLine[newIdx], type: 'added' });
            newIdx++;
        }
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
                                        ))
                                    }
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