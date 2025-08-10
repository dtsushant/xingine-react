import React, { useState, useEffect } from 'react';

interface JsonViewerProps {
    data: any;
    title?: string;
    editable?: boolean;
    onChange?: (newData: any) => void;
    className?: string;
}

export const JsonViewerRenderer: React.FC<JsonViewerProps> = ({
                                                          data,
                                                          title = 'JSON Data',
                                                          editable = false,
                                                          onChange,
                                                          className = ''
                                                      }) => {
    const [jsonString, setJsonString] = useState('');
    const [isValid, setIsValid] = useState(true);
    const [isExpanded, setIsExpanded] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Update JSON string when data changes
    useEffect(() => {
        try {
            setJsonString(JSON.stringify(data, null, 2));
            setIsValid(true);
            setError(null);
        } catch (err) {
            setError('Failed to serialize data');
            setIsValid(false);
        }
    }, [data]);

    const handleJsonChange = (value: string) => {
        setJsonString(value);

        try {
            const parsed = JSON.parse(value);
            setIsValid(true);
            setError(null);

            if (onChange) {
                onChange(parsed);
            }
        } catch (err) {
            setIsValid(false);
            setError(err instanceof Error ? err.message : 'Invalid JSON');
        }
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(jsonString);
            // Optional: Show toast notification
        } catch (err) {
            console.error('Failed to copy to clipboard:', err);
        }
    };

    const formatJson = () => {
        try {
            const parsed = JSON.parse(jsonString);
            const formatted = JSON.stringify(parsed, null, 2);
            setJsonString(formatted);
            setIsValid(true);
            setError(null);
        } catch (err) {
            setError('Cannot format invalid JSON');
        }
    };

    const minifyJson = () => {
        try {
            const parsed = JSON.parse(jsonString);
            const minified = JSON.stringify(parsed);
            setJsonString(minified);
            setIsValid(true);
            setError(null);
        } catch (err) {
            setError('Cannot minify invalid JSON');
        }
    };

    return (
        <div className={`json-viewer border rounded-lg overflow-hidden ${className}`}>
            {/* Header */}
            <div className="bg-gray-100 px-4 py-2 border-b flex justify-between items-center">
                <h3 className="font-medium text-gray-700">{title}</h3>
                <div className="flex items-center space-x-2">
                    {editable && (
                        <>
                            <button
                                onClick={formatJson}
                                className="text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                disabled={!isValid}
                            >
                                Format
                            </button>
                            <button
                                onClick={minifyJson}
                                className="text-xs px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                                disabled={!isValid}
                            >
                                Minify
                            </button>
                        </>
                    )}
                    <button
                        onClick={copyToClipboard}
                        className="text-xs px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                        Copy
                    </button>
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-xs px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                        {isExpanded ? 'Collapse' : 'Expand'}
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className={`${isExpanded ? 'max-h-none' : 'max-h-64'} overflow-auto`}>
                {editable ? (
                    <div className="relative">
            <textarea
                value={jsonString}
                onChange={(e) => handleJsonChange(e.target.value)}
                className={`w-full h-64 p-4 font-mono text-sm border-none resize-none focus:outline-none ${
                    isValid ? 'bg-white' : 'bg-red-50'
                }`}
                placeholder="Enter valid JSON..."
            />
                        {error && (
                            <div className="absolute bottom-2 left-2 right-2 bg-red-100 border border-red-400 text-red-700 px-2 py-1 rounded text-xs">
                                Error: {error}
                            </div>
                        )}
                    </div>
                ) : (
                    <pre className="p-4 text-sm font-mono bg-gray-50 overflow-auto">
            {jsonString}
          </pre>
                )}
            </div>

            {/* Footer with validation status */}
            <div className="bg-gray-50 px-4 py-2 border-t text-xs">
                <div className="flex justify-between items-center">
          <span className={`font-medium ${isValid ? 'text-green-600' : 'text-red-600'}`}>
            {isValid ? '✓ Valid JSON' : '✗ Invalid JSON'}
          </span>
                    <span className="text-gray-500">
            Size: {jsonString.length} characters
          </span>
                </div>
            </div>
        </div>
    );
};

