import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TradingSetting } from "@/type"; // Import the TradingSetting type
import { getTradingSettings } from "@/app/actions/tradingActions"; // Assume this function fetches trading settings

export default function TradingSettings() {
    const [tradingSettings, setTradingSettings] = useState<TradingSetting[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTradingSettings = async () => {
            const settings = await getTradingSettings(); // Fetch trading settings
            setTradingSettings(settings);
            setIsLoading(false);
        };
        fetchTradingSettings();
    }, []);

    if (isLoading) {
        return <div>Loading...</div>; // Loading state
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Trading Settings</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-4">
                    {tradingSettings.map((setting) => (
                        <div key={setting.id} className="border border-gray-200 p-4 rounded-md">
                            <div>
                                <label htmlFor={`seconds-${setting.id}`}>Seconds</label>
                                <Input id={`seconds-${setting.id}`} value={setting.seconds} readOnly />
                            </div>
                            <div>
                                <label htmlFor={`percentage-${setting.id}`}>Percentage</label>
                                <Input id={`percentage-${setting.id}`} value={setting.percentage} readOnly />
                            </div>
                            <div>
                                <label htmlFor={`tradingType-${setting.id}`}>Trading Type</label>
                                <Input id={`tradingType-${setting.id}`} value={setting.tradingType} readOnly />
                            </div>
                            <div>
                                <label htmlFor={`winRate-${setting.id}`}>Win Rate</label>
                                <Input id={`winRate-${setting.id}`} value={setting.winRate} readOnly />
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
