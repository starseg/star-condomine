import ActionButton from "@/components/actionButton";
import ActionSet from "@/components/lobby/actionSet";
import {
  CalendarBlank,
  CalendarCheck,
  Car,
  DeviceMobileCamera,
  HouseLine,
  IdentificationCard,
  MagnifyingGlass,
  Notepad,
  PersonSimpleRun,
  SealWarning,
} from "@phosphor-icons/react/dist/ssr";

export default function NewLobby() {
  return (
    <section className="max-w-5xl mx-auto mb-24">
      <div>
        <h1 className="text-4xl mt-2 text-primary mb-12">
          Portaria: San Lorenzo
        </h1>
      </div>
      <div className="flex">
        <div className="w-1/2 border-r border-stone-50">
          <div>
            <h2 className="flex text-3xl mb-4">
              <PersonSimpleRun className="mr-2" />
              Acessos
            </h2>
            <ActionSet register="" list="" />
          </div>
          <div>
            <h2 className="flex text-3xl mt-12 mb-4">
              <CalendarCheck className="mr-2" />
              Agendamentos
            </h2>
            <ActionSet register="" list="" />
          </div>
          <div>
            <h2 className="flex text-3xl mt-12 mb-4">
              <IdentificationCard className="mr-2" />
              Visitantes
            </h2>
            <ActionSet register="" list="" />
          </div>
          <div>
            <h2 className="flex text-3xl mt-12 mb-4">
              <HouseLine className="mr-2" />
              Moradores
            </h2>
            <ActionSet register="" list="" />
          </div>
          <div>
            <h2 className="flex text-3xl mt-12 mb-4">
              <Car className="mr-2" />
              Veículos
            </h2>
            <ActionSet register="" list="" />
          </div>
        </div>
        <div className="w-1/2 ml-8">
          <div>
            <h2 className="flex text-3xl mb-4">
              <DeviceMobileCamera className="mr-2" />
              Dispositivos
            </h2>
            <ActionSet register="" list="" />
          </div>
          <div>
            <h2 className="flex text-3xl mt-12 mb-4">
              <SealWarning className="mr-2" />
              Problemas
            </h2>
            <ActionSet register="" list="" />
          </div>
          <div>
            <h2 className="flex text-3xl mt-12 mb-4">
              <CalendarBlank className="mr-2" />
              Calendário de Feriados
            </h2>
            <ActionSet register="" list="" />
          </div>
          <div>
            <h2 className="flex text-3xl mt-12 mb-4">
              <Notepad className="mr-2" />
              Relatórios
            </h2>
            <div className="flex gap-4">
              <ActionButton url="" type="+" text="Gerar" />
              <ActionButton url="" type="-" text="Visualizar" />
            </div>
          </div>
          <div>
            <h2 className="flex text-3xl mt-12 mb-4">
              <MagnifyingGlass className="mr-2" />
              Detalhes
            </h2>
            <ActionButton url="" type="-" text="Visualizar" />
          </div>
        </div>
      </div>
    </section>
  );
}
