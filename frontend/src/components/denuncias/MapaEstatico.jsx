import { AspectRatio } from "@radix-ui/react-aspect-ratio";

const MapaEstatico = ({local}) => {
    const mapUrl = ``

    return (
        <div className={`rounded-lg overflow-hidden border mb-4`}>
            <AspectRatio ratio={3/2}>
                <div className="ralitive w-full h-full">
                    <img 
                        src={mapUrl} 
                        alt={`Mapa da Localização: ${local}`} 
                        className="w-full h-full object-cover"    
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"/>
                    <div className="absolute bottom-2 left-2 right-2">
                        <p className="text-xs text-white bg-black/50 px-2 py-1 rounded backdrop-blur-sm">
                            📍{local}
                        </p>
                    </div>
                </div>
            </AspectRatio>
        </div>
    )
}

export default MapaEstatico