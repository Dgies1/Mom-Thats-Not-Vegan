import { NextRequest, NextResponse } from 'next/server';
import { HfInference } from '@huggingface/inference';

const HF_TOKEN = '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';
const inference = new HfInference(HF_TOKEN);

export async function GET(req: NextRequest) {
    try {
        const response = await inference.textToImage({
            model: 'artificialguybr/StickersRedmond',
            inputs: "A die cut sticker for an app called 'Mom, That's Not Vegan' that draws inspiration from Miami colors",
            parameters: {
                num_inference_steps: 100,
                guidance_scale: 0.1,

            },
        });

        // Assuming response is a Blob
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64Image = buffer.toString('base64');

        return NextResponse.json({ data: `data:image/png;base64,${base64Image}` });
    } catch (error) {
        console.error('Error generating image:', error);
        return new NextResponse('Error generating image', { status: 500 });
    }
}
