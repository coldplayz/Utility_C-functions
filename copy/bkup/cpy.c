#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <unistd.h>
#include <stdlib.h>
#include <string.h>
#include <stdarg.h>
#include <stdio.h>
#include <dirent.h>
#include <errno.h>
#include <signal.h>
#include "main.h"

#define ex (execve("/bin/ls", args, NULL) == (-1))
#define ps(x) (printf("%s\n", (x)))
#define pd(x) (printf("%d\n", (x)))
#define plu(x) (printf("%lu", (x)))
#define BUFSIZE 16

/**
 * main - copies the files represented by the
 * names in the file updir to the directory specified on input prompt.
 *
 * Description: The file updir has to be in the PWD.
 * If relative paths are specified, then use the
 * full notation e.g. ./folder or ../folder, as against folder.
 */
int main(void)
{
	int fdrd, i, n;
	char *buff1, *buff2, *dest, **sarr;
	int bsize = BUFSIZE, old_bsize = 0;

	fdrd = open("updir", O_RDONLY);
	if (fdrd == -1)
	{
		perror("fdrd-open");
		return (1);
	}

	buff1 = malloc(BUFSIZE);

	for (i = 0; 1; i++)
	{
		n = read(fdrd, (buff1 + old_bsize), BUFSIZE); //old_bsize specifies the next read position in buff1
		if (n == -1)
		{
			perror("fdrd-read");
			return (1);
		}

		if (n >= BUFSIZE)
		{
			old_bsize = bsize;
			bsize += BUFSIZE;
			buff1 = realloc(buff1, bsize);
			if (!buff1)
			{
				perror("buff1-realloc");
				return (1);
			}
		}

		if (n < BUFSIZE) //end of file condition where there's enough space for a terminating null byte.
		{
			break;
		}
	}
	buff1[old_bsize + n] = 0;

	tr2(&buff1, ' '); //replace all nwline characters with space xter.

	dest = malloc(16);
	if (!dest)
	{
		perror("dest-malloc");
		return (1);
	}

	printf("Directory to update: ");
	scanf("%s", dest); //wait for user input
	buff2 = strconcatl(3, "cp -u ", buff1, dest);
	sarr = str_arr(buff2, " \n");

	if (execve("/usr/bin/cp", sarr, NULL) == -1)
	{
		perror("execve");
		return (1);
	}

	free(buff1);
	free(buff2);
	free(sarr);
	close(fdrd);

	return (1);
}
