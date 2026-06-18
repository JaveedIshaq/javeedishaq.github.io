import Link from "next/link";

import { Icons } from "@/components/common/icons";
import { contributionsInterface } from "@/config/contributions";

interface ContributionCardProps {
  contributions: contributionsInterface[];
}

export default function ContributionCard({
  contributions,
}: ContributionCardProps) {
  return (
    <div className="space-y-8">
      {/* My Open Source Projects Section */}
      <div>
        <div className="mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Icons.gitRepoIcon size={20} className="text-primary" />
            My Open Source Projects
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Projects I have built and open-sourced for the developer community
          </p>
        </div>
        <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
          {contributions
            .filter((c) => c.repoOwner === "JaveedIshaq")
            .map((contribution, id) => (
              <Link
                href={contribution.link}
                target="_blank"
                key={`own-${id}`}
                className="w-full min-w-0 h-full"
              >
                <div className="relative rounded-lg border bg-background p-2 hover:bg-accent hover:text-accent-foreground transition-colors w-full h-full flex flex-col">
                  <span className="absolute top-2 right-2 text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                    My Project
                  </span>
                  <Icons.externalLink
                    size={35}
                    className="absolute bottom-3 right-3 border bg-background rounded-full p-1.5 sm:p-2 cursor-pointer text-muted-foreground z-10 w-8 h-8 sm:w-10 sm:h-10"
                  />
                  <div className="flex min-h-[170px] flex-col justify-between rounded-md p-4 sm:p-6 pb-12 sm:pb-6 flex-grow">
                    <div className="flex flex-row justify-between items-start gap-2 mb-4 min-w-0">
                      <h3 className="font-bold flex space-x-2 items-center min-w-0 flex-1">
                        <Icons.gitRepoIcon
                          size={18}
                          className="flex-shrink-0 sm:w-5 sm:h-5"
                        />
                        <span className="truncate text-sm sm:text-base min-w-0">
                          {contribution.repo}
                        </span>
                      </h3>
                    </div>
                    <div className="space-y-3 sm:space-y-4 min-w-0">
                      <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3 break-words">
                        {contribution.contibutionDescription}
                      </p>
                      <p className="text-xs sm:text-sm text-muted-foreground flex space-x-2 items-center min-w-0">
                        <Icons.gitHub
                          size={14}
                          className="flex-shrink-0 sm:w-4 sm:h-4"
                        />
                        <span className="truncate min-w-0">
                          JaveedIshaq
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}
